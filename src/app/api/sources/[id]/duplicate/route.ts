import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { duplicateSource } from "@/lib/server/service";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    if (!id) {
      return badRequest("Missing source id.");
    }

    const source = await duplicateSource(userId, id);
    return ok({ source }, 201);
  } catch (error) {
    return serverError(error);
  }
}
