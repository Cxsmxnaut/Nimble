import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { submitAttempt } from "@/lib/server/service";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    const payload = (await request.json()) as {
      questionId?: string;
      answer?: string;
      isRetry?: boolean;
    };

    if (!id || !payload.questionId) {
      return badRequest("Session id and question id are required.");
    }

    if (!payload.answer || payload.answer.trim().length === 0) {
      return badRequest("Answer cannot be empty.");
    }

    const result = await submitAttempt(userId, id, {
      questionId: payload.questionId,
      answer: payload.answer,
      isRetry: payload.isRetry,
    });
    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}
