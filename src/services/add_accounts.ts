import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./apiClient";

type MessageHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;

  connect(onOpen?: () => void) {
    this.socket = io(`ws://${process.env.NEXT_PUBLIC_API}`, {
      transports: ["websocket"],
      auth: {
        token: getAccessToken(), // 👈 Token is sent here instead
      },
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected");
      this.socket!.emit("init"); // safe now
      // تنفيذ الدالة الاختيارية بعد الاتصال
      onOpen?.();
    });

    // this.socket.on("disconnect", (reason) => {
    //   console.warn("❌ Socket disconnected:", reason);
    //   this.socket = null;
    // });

    this.socket.on("authenticated", () => {});
  }

  on(event: string, handler: MessageHandler) {
    this.socket?.on(event, (data) => {
      console.log(`📨 [Socket] event "${event}":`, data);
      handler(data);
    });
  }

  // close() {
  //   this.socket?.disconnect();
  //   this.socket = null;
  // }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const wsService = new SocketService();
