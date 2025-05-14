// تعريف نوع الدالة التي تستقبل الرسائل
type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private handlers: MessageHandler[] = [];

  // عنوان الخادم (ثابت داخل الكلاس)
  private readonly serverUrl = 'ws://localhost:3001';

  // الاتصال بالخادم
  connect(onOpen?: () => void) {
    this.socket = new WebSocket(this.serverUrl);

    this.socket.onopen = () => {
      onOpen?.(); // تنفيذ عند نجاح الاتصال
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handlers.forEach((handler) => handler(data)); // تمرير الرسائل لجميع المستمعين
    };

    this.socket.onclose = () => {
      this.socket = null;
    };
  }

  // إرسال رسالة إلى السيرفر
  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  // إضافة دالة تستمع للرسائل
  onMessage(handler: MessageHandler) {
    this.handlers.push(handler);
  }

  // إغلاق الاتصال
  close() {
    this.socket?.close();
    this.socket = null;
  }

  // التحقق من حالة الاتصال
  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// إنشاء نسخة جاهزة للاستخدام
export const wsService = new WebSocketService();
