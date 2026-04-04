import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { startSession } from "@/lib/server/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const payload = (await request.json().catch(() => ({}))) as {
      sourceId?: string;
      mode?: "standard" | "focus" | "weak_review" | "fast_drill";
    };
    const mode = payload.mode;
    if (mode && !["standard", "focus", "weak_review", "fast_drill"].includes(mode)) {
      return badRequest("Invalid study mode.");
    }
    const session = await startSession(userId, { sourceId: payload.sourceId, mode });
    return ok(session, 201);
  } catch (error) {
    return serverError(error);
  }
}
