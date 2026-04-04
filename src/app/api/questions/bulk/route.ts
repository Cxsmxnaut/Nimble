import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { deleteQuestions } from "@/lib/server/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const payload = (await request.json()) as { questionIds?: string[] };
    if (!Array.isArray(payload.questionIds) || payload.questionIds.length === 0) {
      return badRequest("questionIds must be a non-empty array.");
    }

    const result = await deleteQuestions(userId, payload.questionIds);
    return ok(result);
  } catch (error) {
    return serverError(error);
  }
}
