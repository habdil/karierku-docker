export interface Message {
    id: string;
    consultationId: string; 
    senderId: string;
    content: string;
    type: 'TEXT';
    createdAt: Date;
    readAt?: Date;
  }
  
  export interface ChatParticipant {
    id: string;
    name: string;
    image?: string;
    status?: 'online' | 'offline';
    lastSeen?: Date;
  }
  
  export interface ChatRoom {
    consultationId: string;
    status: 'ACTIVE' | 'COMPLETED';
    participant: ChatParticipant;
    messages: Message[];
    lastMessageAt?: Date;
  }