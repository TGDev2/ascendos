import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@ascendos/ai';
import { buildGenerateUpdatePrompt } from '@ascendos/ai';
import { getMasterProfile, getSituationTemplate } from '@ascendos/templates';
import { generatedUpdateOutputSchema } from '@ascendos/validators';

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
