interface ConnectedClient {
    controller: ReadableStreamDefaultController;
    consultationId: string;
  }
  
  const clients = new Set<ConnectedClient>();
  
  export function addClient(controller: ReadableStreamDefaultController, consultationId: string) {
    const client: ConnectedClient = { controller, consultationId };
    clients.add(client);
    return client;
  }
  
  export function removeClient(client: ConnectedClient) {
    clients.delete(client);
  }
  
  export async function broadcastMessage(message: any, consultationId: string) {
    const encoder = new TextEncoder();
    console.log(`Broadcasting message to consultationId: ${consultationId}`);
  
    clients.forEach((client) => {
      if (client.consultationId === consultationId) {
        client.controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
      }
    });
  }
  