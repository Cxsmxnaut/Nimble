import { resolveUserId } from "@/lib/server/auth";
import { ok, serverError } from "@/lib/server/http";
import { getProgress } from "@/lib/server/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const progress = await getProgress(userId);
    return ok(progress);
  } catch (error) {
    return serverError(error);
  }
}
