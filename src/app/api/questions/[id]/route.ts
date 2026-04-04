import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { updateQuestion } from "@/lib/server/service";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    const payload = (await request.json()) as { prompt?: string; answer?: string };
    if (!id) {
      return badRequest("Question id is required.");
    }

    if (!payload.prompt && !payload.answer) {
      return badRequest("Nothing to update.");
    }

    const question = await updateQuestion(userId, id, payload);
    return ok({ question });
  } catch (error) {
    return serverError(error);
  }
}
