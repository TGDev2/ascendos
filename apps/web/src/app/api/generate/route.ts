import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@ascendos/ai';
import { buildGenerateUpdatePrompt } from '@ascendos/ai';
import { getMasterProfile, getSituationTemplate } from '@ascendos/templates';
import { generatedUpdateOutputSchema } from '@ascendos/validators';
import { auth } from '@clerk/nextjs/server';
import { db, rateLimiter } from '@ascendos/database';

export const runtime = 'edge';
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

    // Rate limiting (pour utilisateurs authentifiés)
    const { userId } = await auth();

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
    const startTime = Date.now();
    const { text, usage } = await generateText({
      model: getModel('openai', 'gpt-5-mini-2025-08-07'),
      system,
      prompt: user,
      temperature: 0.7,
      maxTokens: 2000,
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
