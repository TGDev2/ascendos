import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@ascendos/ai';
import { buildGenerateUpdatePrompt } from '@ascendos/ai';
import { getMasterProfile, getSituationTemplate } from '@ascendos/templates';
import { generatedUpdateOutputSchema } from '@ascendos/validators';
import { auth } from '@clerk/nextjs/server';
import { db, rateLimiter, alertSystem } from '@ascendos/database';

// Prisma requires Node.js runtime (incompatible with edge)
export const runtime = 'nodejs';
export const maxDuration = 30;

interface GenerateRequest {
  facts: Array<{ text: string }>;
  decisionsNeeded: Array<{ description: string; deadline?: string }>;
  risksInput: Array<{ description: string; impact: string; mitigation?: string }>;
  masterProfileSlug: string;
  situationType: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body: GenerateRequest = await req.json();

    // Validate input
    if (!body.masterProfileSlug || !body.situationType) {
      return NextResponse.json(
        { error: 'Missing required fields: masterProfileSlug and situationType' },
        { status: 400 }
      );
    }

    // Check authentication
    const { userId } = await auth();

    // Protection pour utilisateurs anonymes
    if (!userId) {
      // 1. Validation des headers Origin/Referer (protection contre les requêtes cross-origin non autorisées)
      const origin = req.headers.get('origin');
      const referer = req.headers.get('referer');
      const host = req.headers.get('host');

      // En production, vérifier que la requête vient bien de votre domaine
      if (process.env.NODE_ENV === 'production') {
        // Extraire les hostnames autorisés de manière sécurisée
        const allowedHostnames: string[] = [];

        if (host) {
          // host peut être "domain.com" ou "domain.com:port"
          allowedHostnames.push(host.split(':')[0]);
        }

        if (process.env.NEXT_PUBLIC_APP_URL) {
          try {
            const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL);
            allowedHostnames.push(appUrl.hostname);
          } catch {
            // URL invalide, ignorer
          }
        }

        // Validation stricte par comparaison de hostname exact
        const getHostname = (url: string): string | null => {
          try {
            return new URL(url).hostname;
          } catch {
            return null;
          }
        };

        const originHostname = origin ? getHostname(origin) : null;
        const refererHostname = referer ? getHostname(referer) : null;

        const isValidOrigin = originHostname !== null &&
          allowedHostnames.some(allowed => originHostname === allowed);
        const isValidReferer = refererHostname !== null &&
          allowedHostnames.some(allowed => refererHostname === allowed);

        if (!isValidOrigin && !isValidReferer) {
          const ip = req.headers.get('x-forwarded-for')
            || req.headers.get('x-real-ip')
            || 'unknown';

          // Logger et envoyer une alerte
          console.warn(`[SECURITY] Blocked request from invalid origin/referer: ${origin || referer || 'none'}`);
          await alertSystem.send(
            alertSystem.unauthorizedAccessAlert(
              ip,
              `Invalid origin/referer: ${origin || referer || 'none'}`
            )
          );

          return NextResponse.json(
            {
              error: 'Invalid request origin',
              message: 'Les requêtes doivent provenir du domaine autorisé.',
            },
            { status: 403 }
          );
        }
      }

      // 2. Extraire l'IP de la requête
      const ip = req.headers.get('x-forwarded-for')
        || req.headers.get('x-real-ip')
        || 'unknown';

      // 3. Rate limiting par IP (3 requêtes/heure)
      const rateLimitResult = await rateLimiter.checkAnonymousRequest(ip);

      if (!rateLimitResult.allowed) {
        // Tracker l'IP bloquée pour monitoring
        await rateLimiter.trackBlockedIP(ip, 'rate_limit_exceeded');

        // Vérifier si c'est un pattern d'abuse (bloqué plusieurs fois)
        const blockCount = await rateLimiter.getIPBlockCount(ip);
        if (blockCount >= 5) {
          // Envoyer une alerte pour activité suspecte
          await alertSystem.send(alertSystem.rateLimitAlert(ip, blockCount));
        }

        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Vous avez atteint la limite de 3 générations par heure pour les utilisateurs non connectés. Créez un compte gratuit pour obtenir plus de générations.',
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            resetAt: rateLimitResult.resetAt,
            signUpUrl: '/sign-up',
          },
          { status: 429 }
        );
      }

      // 4. Validation stricte des inputs pour les anonymes
      if (body.facts.length > 5) {
        return NextResponse.json(
          {
            error: 'Input limit exceeded',
            message: 'Maximum 5 faits autorisés pour les utilisateurs non connectés. Créez un compte pour plus de capacité.',
            signUpUrl: '/sign-up',
          },
          { status: 400 }
        );
      }

      if (body.decisionsNeeded.length > 3) {
        return NextResponse.json(
          {
            error: 'Input limit exceeded',
            message: 'Maximum 3 décisions autorisées pour les utilisateurs non connectés. Créez un compte pour plus de capacité.',
            signUpUrl: '/sign-up',
          },
          { status: 400 }
        );
      }

      if (body.risksInput.length > 3) {
        return NextResponse.json(
          {
            error: 'Input limit exceeded',
            message: 'Maximum 3 risques autorisés pour les utilisateurs non connectés. Créez un compte pour plus de capacité.',
            signUpUrl: '/sign-up',
          },
          { status: 400 }
        );
      }

      // 5. Validation de la longueur des textes pour éviter l'abuse
      const maxTextLength = 500;

      for (const fact of body.facts) {
        if (fact.text.length > maxTextLength) {
          return NextResponse.json(
            {
              error: 'Input too long',
              message: `Chaque fait doit faire maximum ${maxTextLength} caractères pour les utilisateurs non connectés.`,
              signUpUrl: '/sign-up',
            },
            { status: 400 }
          );
        }
      }

      for (const decision of body.decisionsNeeded) {
        if (decision.description.length > maxTextLength) {
          return NextResponse.json(
            {
              error: 'Input too long',
              message: `Chaque décision doit faire maximum ${maxTextLength} caractères pour les utilisateurs non connectés.`,
              signUpUrl: '/sign-up',
            },
            { status: 400 }
          );
        }
      }

      for (const risk of body.risksInput) {
        if (risk.description.length > maxTextLength || risk.impact.length > maxTextLength) {
          return NextResponse.json(
            {
              error: 'Input too long',
              message: `Chaque risque doit faire maximum ${maxTextLength} caractères pour les utilisateurs non connectés.`,
              signUpUrl: '/sign-up',
            },
            { status: 400 }
          );
        }
      }

      // Log pour monitoring (sans données sensibles)
      console.log(`[ANONYMOUS] Generation request from IP: ${ip.substring(0, 10)}... | Remaining: ${rateLimitResult.remaining}`);
    }

    // Rate limiting pour utilisateurs authentifiés
    if (userId) {
      // Récupérer l'utilisateur et son organisation
      const user = await db.user.findUnique({
        where: { clerkId: userId },
        include: { organization: true },
      });

      if (!user || !user.organization) {
        return NextResponse.json(
          { error: 'User or organization not found' },
          { status: 404 }
        );
      }

      // Vérifier si le trial est expiré
      if (user.organization.plan === 'TRIAL' && user.organization.trialEndsAt) {
        const now = new Date();
        if (now > new Date(user.organization.trialEndsAt)) {
          return NextResponse.json(
            {
              error: 'Trial expired',
              message: 'Votre période d\'essai est expirée. Veuillez upgrader votre plan pour continuer.',
              upgradeUrl: '/settings/billing',
            },
            { status: 403 }
          );
        }
      }

      // Vérifier le rate limit
      const rateLimitResult = await rateLimiter.checkAndIncrement(
        user.organization.plan,
        user.organization.id,
        user.id,
        user.organization.trialEndsAt
      );

      if (!rateLimitResult.allowed) {
        const message = user.organization.plan === 'TRIAL'
          ? `Limite atteinte (${rateLimitResult.limit} générations pour le trial). Veuillez upgrader votre plan.`
          : `Limite quotidienne atteinte (${rateLimitResult.limit} générations/jour). Revenez demain ou upgradez votre plan.`;

        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message,
            limit: rateLimitResult.limit,
            remaining: rateLimitResult.remaining,
            resetAt: rateLimitResult.resetAt,
            upgradeUrl: '/settings/billing',
          },
          { status: 429 }
        );
      }
    }

    // Get master profile and situation template
    const masterProfile = getMasterProfile(body.masterProfileSlug);
    const situation = getSituationTemplate(body.situationType as any);

    if (!masterProfile) {
      return NextResponse.json(
        { error: 'Invalid masterProfileSlug' },
        { status: 400 }
      );
    }

    if (!situation) {
      return NextResponse.json(
        { error: 'Invalid situationType' },
        { status: 400 }
      );
    }

    // Build prompt
    const promptJson = buildGenerateUpdatePrompt({
      facts: body.facts,
      decisionsNeeded: body.decisionsNeeded,
      risksInput: body.risksInput,
      masterProfile,
      situation,
    });

    const { system, user } = JSON.parse(promptJson);

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'API key not configured',
          message: 'Please add OPENAI_API_KEY to your .env.local file. Get one at https://platform.openai.com'
        },
        { status: 500 }
      );
    }

    // Generate with OpenAI (gpt-5-mini-2025-08-07)
    // Réduction drastique de maxTokens pour les utilisateurs anonymes (75% de réduction)
    const maxTokens = userId ? 2000 : 500;

    const startTime = Date.now();
    const { text, usage } = await generateText({
      model: getModel('openai', 'gpt-5-mini-2025-08-07'),
      system,
      prompt: user,
      temperature: 0.7,
      maxTokens,
    });

    const generationTimeMs = Date.now() - startTime;

    // Logger l'usage si authentifié
    if (userId) {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
        select: { id: true, organizationId: true },
      });

      if (user) {
        await db.usageLog.create({
          data: {
            organizationId: user.organizationId,
            userId: user.id,
            action: 'generate_update',
            tokensUsed: usage?.totalTokens || 0,
            modelUsed: 'gpt-5-mini-2025-08-07',
          },
        });
      }
    }

    // Parse JSON response
    let output;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      output = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse LLM output:', text);
      return NextResponse.json(
        {
          error: 'Invalid JSON response from AI',
          rawResponse: text.substring(0, 500),
        },
        { status: 500 }
      );
    }

    // Validate output with Zod
    const validatedOutput = generatedUpdateOutputSchema.parse(output);

    // Return response
    return NextResponse.json({
      ...validatedOutput,
      metadata: {
        generatedWith: 'gpt-5-mini-2025-08-07',
        tokensUsed: usage?.totalTokens || 0,
        generationTimeMs,
      },
    });

  } catch (error) {
    console.error('Error in /api/generate:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
