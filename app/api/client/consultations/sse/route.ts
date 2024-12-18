import { NextRequest } from "next/server";
import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { addClient, removeClient } from "@/lib/sseClient";

interface ConnectedClient {
  controller: ReadableStreamDefaultController;
  clientId: string;
}

const clients = new Set<ConnectedClient>();

export async function GET(req: NextRequest) {
  const session = await getClientSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const clientId = session.clientId;
  console.log(`SSE stream opened for client: ${clientId}`);

  const stream = new ReadableStream({
    start(controller) {
      const client = addClient(controller, clientId);

      req.signal.addEventListener("abort", () => {
        console.log(`SSE stream closed for client: ${clientId}`);
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