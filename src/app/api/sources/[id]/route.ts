import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { archiveSource, getSource } from "@/lib/server/service";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    if (!id) {
      return badRequest("Missing source id.");
    }

    const source = await getSource(userId, id);
    return ok({ source });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = await resolveUserId(request);
    const { id } = await context.params;
    if (!id) {
      return badRequest("Missing source id.");
    }

    await archiveSource(userId, id);
    return ok({ deleted: true });
  } catch (error) {
    return serverError(error);
  }
}
