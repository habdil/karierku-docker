export interface Message {
  id: string;
  consultationId: string; 
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  type: 'TEXT' | 'SYSTEM';
  status: 'SENT' | 'DELIVERED' | 'READ';
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

// Additional types
export interface ChatState {
  isLoading: boolean;
  error: string | null;
  messages: Message[];
  hasMore: boolean;
  pageSize: number;
  currentPage: number;
}

export interface ChatEvents {
  onMessageSent?: (message: Message) => void;
  onMessageRead?: (messageId: string) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
}

export interface ChatMetadata {
  totalMessages: number;
  unreadCount: number;
  lastReadMessageId?: string;
}