import { ScheduledMessage } from "@/types/scheduled-message";
import { apiClient } from "./apiClient";

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
    // console.log(payload)
    const res = await apiClient.post("/schedules", payload);
    return res;
  } catch (error) {
    console.error("فشل في إرسال الرسالة:", error);
    throw error;
  }
};



// جديد

export const updateScheduledMessageOnAPI = async (
  id: string,
  updatedData: Partial<ScheduledMessage>
): Promise<boolean> => {
  try {
    await apiClient.patch(`/schedules/${id}`, updatedData);
    return true;
  } catch (error) {
    console.error(`فشل في تحديث الرسالة #${id}:`, error);
    return false;
  }
};

export const getScheduledMessages = async () => {
  try {
    const response = await apiClient.get("/schedules");
    // console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteScheduledMessage = async (messageId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/schedules/${messageId}`);
    return true;
  } catch (error) {
    console.error(`فشل في حذف الرسالة #${messageId}:`, error);
    return false;
  }
};
