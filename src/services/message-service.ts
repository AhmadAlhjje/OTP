import { apiClient } from "./apiClient";

// ارسال رسالة واتساب
export const sendWhatsappMessage = async ({
  to,
  message,
}: {
  to: string[];
  message: string;
}) => {
  console.log("to" , to)
  console.log("message" , message)
  try {
    const res = await apiClient.post(`/whatsapp/send-message`, {
      to,
      message,
    });

    return res;
  } catch (error) {
    console.error("فشل في إرسال الرسالة:", error);
    throw error;
  }
};

