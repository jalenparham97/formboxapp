import { type NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/server/db";
import {
  getRange,
  addSheetEntry,
  updateSheetHeaders,
} from "@/libs/nango/integrations/google-sheets";

// QStash will call this endpoint with the data it received earlier.
async function handler(req: NextRequest) {
  const data = await req.json();

  try {
    const integration = await db.integration.findFirst({
      where: { formId: data.formId, type: "google-sheets" },
    });

    if (!integration) {
      return NextResponse.json(
        { success: true, message: "No google-sheets integration found" },
        { status: 200 },
      );
    }

    if (!integration.isEnabled) {
      return NextResponse.json(
        { success: true, message: "Integration is disabled" },
        { status: 200 },
      );
    }

    const { connectionId, spreadsheetId } = integration;

    console.log("Answers: ", data.answers);

    await updateSheetHeaders(
      connectionId,
      spreadsheetId as string,
      getRange(Object.keys(data.answers).length),
      [[...Object.keys(data.answers)] as string[]],
    );

    await addSheetEntry(
      connectionId,
      spreadsheetId as string,
      getRange(Object.keys(data.answers).length),
      [[...Object.values(data.answers)] as string[]],
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("ERROR: ", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// It is very important to add this line as this makes
// sure that only QStash can successfully call this endpoint.
// It will make use of the QSTASH_CURRENT_SIGNING_KEY and
// QSTASH_NEXT_SIGNING_KEY from your .env file.
export const POST = verifySignatureAppRouter(handler);
// export const POST = handler;
