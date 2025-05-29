import { apiClient } from "./apiClient";

interface WhatsAppMessageRequest {
  recipients: string[];
  message: string;
  scheduledTime?: string; 
  messageDelayMs: number;
}

// ارسال رسالة مجدولة
export const sendWhatsappMessage = async ({
  to,
  message,
  scheduledAt,
}: {
  to: string[];
  message: string;
  scheduledAt?: string;
}) => {
    
  try {
    const payload = {
      recipients: to,
      message: message,
      scheduledTime: scheduledAt, 
      messageDelayMs: 5000, // ← قيمة ثابتة لا يدخلها المستخدم
    };
    console.log(payload)
    const res = await apiClient.post("/schedules", payload);
    return res;
  } catch (error) {
    console.error("فشل في إرسال الرسالة:", error);
    throw error;
  }
};



// جديد

export const getScheduledMessages = async () => {
  try {
    const response = await apiClient.get("/api/scheduled-messages");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteScheduledMessage = async (messageId: string) => {
  try {
    await apiClient.delete(`/api/scheduled-messages/${messageId}`);
  } catch (error) {
    throw error;
  }
};
