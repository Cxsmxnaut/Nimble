import { type CSVMapping } from "@/lib/domain/types";
import { resolveUserId } from "@/lib/server/auth";
import { badRequest, ok, serverError } from "@/lib/server/http";
import { importCsvFromText, previewCsv } from "@/lib/server/service";

export const runtime = "nodejs";

interface CsvRequest {
  mode?: "preview" | "import";
  title?: string;
  csvText?: string;
  mapping?: CSVMapping;
}

export async function POST(request: Request) {
  try {
    const userId = await resolveUserId(request);
    const body = (await request.json()) as CsvRequest;
    if (!body.csvText || body.csvText.trim().length === 0) {
      return badRequest("CSV text is required.");
    }

    if (body.mode === "preview") {
      const preview = await previewCsv(body.csvText);
      return ok(preview);
    }

    const source = await importCsvFromText(userId, body.title ?? "CSV Import", body.csvText, body.mapping);
    return ok({ source }, 201);
  } catch (error) {
    return serverError(error);
  }
}
