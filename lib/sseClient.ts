import prisma from "@/lib/prisma";

interface ConnectedClient {
  controller: ReadableStreamDefaultController;
  clientId: string;
}

const clients = new Set<ConnectedClient>();

// Fungsi untuk menambahkan client
export function addClient(controller: ReadableStreamDefaultController, clientId: string) {
  const client: ConnectedClient = { controller, clientId };
  clients.add(client);
  return client;
}

// Fungsi untuk menghapus client
export function removeClient(client: ConnectedClient) {
  clients.delete(client);
}

// Fungsi untuk broadcast update konsultasi
export async function broadcastConsultationsUpdate(clientId: string) {
  const encoder = new TextEncoder();

  try {
    const consultations = await prisma.consultation.findMany({
      where: { clientId },
      include: { mentor: true, slot: true },
      orderBy: { updatedAt: "desc" },
    });

    clients.forEach((client) => {
      if (client.clientId === clientId) {
        client.controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(consultations)}\n\n`)
        );
      }
    });
  } catch (error) {
    console.error("Error broadcasting consultations update:", error);
  }
}
