import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { createQuestionForSource, listSourceQuestions } from "@/lib/server/service";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    if (!id) {
      return badRequest("Missing source id.");
    }

    const questions = await listSourceQuestions(userId, id);
    return ok({ questions });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    if (!id) {
      return badRequest("Missing source id.");
    }

    const payload = (await request.json()) as { prompt?: string; answer?: string };
    if (!payload.prompt?.trim() || !payload.answer?.trim()) {
      return badRequest("Prompt and answer are required.");
    }

    const question = await createQuestionForSource(userId, id, {
      prompt: payload.prompt,
      answer: payload.answer,
    });
    return ok({ question }, 201);
  } catch (error) {
    return serverError(error);
  }
}
