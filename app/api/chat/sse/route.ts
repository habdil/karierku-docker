import { NextRequest } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { addClient, removeClient } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession(req);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const consultationId = searchParams.get("consultationId");

  if (!consultationId) {
    return new Response("Consultation ID required", { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const client = addClient(controller, consultationId);
      req.signal.addEventListener("abort", () => {
        console.log(`SSE stream closed for consultationId: ${consultationId}`);
        removeClient(client);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
