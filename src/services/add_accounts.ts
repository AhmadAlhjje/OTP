import { io, Socket } from "socket.io-client";

// نوع خاص لتحديد شكل الدوال التي تعالج الرسائل المستقبلة من السيرفر
type MessageHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  connect(clientId: string, onOpen?: () => void, p0?: () => void) {
    // إنشاء اتصال جديد مع الخادم
    this.socket = io("ws://192.168.74.25:3000", {
      path: "/whatsapp/start",
      transports: ["websocket"],
    });

    // عند نجاح الاتصال
    this.socket.on("connect", () => {
      console.log("Socket connected");

      // إرسال حدث "init" مع clientId إلى الخادم
      this.socket?.emit("init", { clientId });

      // تنفيذ الدالة الاختيارية إذا وُجدت
      onOpen?.();
    });

    // عند انقطاع الاتصال
    this.socket.on("disconnect", (error) => {
      console.log(error);
      this.socket = null;
      console.log("Socket disconnected");
    });
  }

  on(event: string, handler: MessageHandler) {
    this.socket?.on(event, (data) => {
      console.log(`📨 [Socket] event "${event}":`, data);
      handler(data);
    });
  }

  close() {
    // قطع الاتصال إن وُجد
    this.socket?.disconnect();
    this.socket = null; // إعادة المتغير إلى الوضع الافتراضي
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// إنشاء وتوفير نسخة واحدة من الصنف للاستخدام في باقي التطبيق
export const wsService = new SocketService();
