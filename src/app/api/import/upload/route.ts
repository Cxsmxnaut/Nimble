import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { uploadSource } from "@/lib/server/service";

export const runtime = "nodejs";

const ACCEPTED_EXTENSIONS = ["pdf", "docx", "txt", "md", "csv"];

export async function POST(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return badRequest("Upload is missing a file payload.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return badRequest("Supported files: .pdf, .docx, .txt, .md, .csv");
    }

    if (file.size > 8 * 1024 * 1024) {
      return badRequest("File size exceeds 8MB limit.");
    }

    const source = await uploadSource(userId, file);
    return ok({ source }, 201);
  } catch (error) {
    return serverError(error);
  }
}
