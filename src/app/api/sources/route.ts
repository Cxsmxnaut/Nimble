import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { createPasteSource, listSources } from "@/lib/server/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const sources = await listSources(userId);
    return ok({ sources });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const payload = (await request.json()) as { title?: string; content?: string };

    if (!payload.content || payload.content.trim().length < 8) {
      return badRequest("Paste at least a few lines of study material.");
    }

    const source = await createPasteSource(userId, payload.title ?? "", payload.content);
    return ok({ source }, 201);
  } catch (error) {
    return serverError(error);
  }
}
