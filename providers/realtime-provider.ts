type EventCallback = (data: any) => void;

export interface RealtimeProvider {
  publish(channel: string, event: string, payload: any): void;
  subscribe(channel: string, event: string, callback: EventCallback): () => void;
  broadcastTyping(conversationId: string, userId: string, isTyping: boolean): void;
  setUserOnline(userId: string): void;
  setUserOffline(userId: string): void;
  isUserOnline(userId: string): boolean;
}

export class InMemoryRealtimeProvider implements RealtimeProvider {
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private onlineUsers: Set<string> = new Set();
  private typingState: Map<string, Set<string>> = new Map();

  publish(channel: string, event: string, payload: any): void {
    const key = `${channel}:${event}`;
    const subs = this.listeners.get(key);
    if (subs) {
      subs.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error("Realtime subscriber callback error:", err);
        }
      });
    }
  }

  subscribe(channel: string, event: string, callback: EventCallback): () => void {
    const key = `${channel}:${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  broadcastTyping(conversationId: string, userId: string, isTyping: boolean): void {
    if (!this.typingState.has(conversationId)) {
      this.typingState.set(conversationId, new Set());
    }
    const current = this.typingState.get(conversationId)!;
    if (isTyping) {
      current.add(userId);
    } else {
      current.delete(userId);
    }
    this.publish(`conversation:${conversationId}`, "typing", {
      userId,
      isTyping,
      activeTypingUsers: Array.from(current)
    });
  }

  setUserOnline(userId: string): void {
    this.onlineUsers.add(userId);
    this.publish("presence", "online", { userId });
  }

  setUserOffline(userId: string): void {
    this.onlineUsers.delete(userId);
    this.publish("presence", "offline", { userId });
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}

let realtimeInstance: RealtimeProvider | null = null;

export function getRealtimeProvider(): RealtimeProvider {
  if (!realtimeInstance) {
    realtimeInstance = new InMemoryRealtimeProvider();
  }
  return realtimeInstance;
}
