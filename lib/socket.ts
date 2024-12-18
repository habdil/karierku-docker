import { Server } from 'socket.io';

let io: Server;

export function getIO() {
  return io;
}

export function initIO(httpServer: any) {
  if (!io) {
    io = new Server(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-consultation', (consultationId: string) => {
        socket.join(`consultation:${consultationId}`);
        console.log(`Socket ${socket.id} joined consultation:${consultationId}`);
      });

      socket.on('send-message', ({ consultationId, content, senderId }) => {
        io.to(`consultation:${consultationId}`).emit('message-received', {
          content,
          senderId,
          createdAt: new Date()
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return io;
}