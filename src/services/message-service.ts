import { apiClient } from "./apiClient";

export const sendWhatsappMessage = async ({
  fromAccountId,
  to,
  message,
}: {
  fromAccountId: string;
  to: string[];
  message: string;
}) => {
  try {
    const res = await apiClient.post(`/whatsapp/send-message`, {
      fromAccountId,
      to,
      message,
    });

    return res;
  } catch (error) {
    console.error("فشل في إرسال الرسالة:", error);
    throw error;
  }
};
