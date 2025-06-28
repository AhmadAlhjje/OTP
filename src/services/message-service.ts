import { apiClient } from "./apiClient";

// ارسال رسالة واتساب
export const sendWhatsappMessage1 = async ({
  to,
  message,
}: {
  to: string[];
  message: string;
}) => {
  console.log("to", to);
  console.log("message", message);
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

export const sendWhatsappMessagesBatch = async (
  messages: { number: string; message: string }[]
) => {
  try {
    const res = await apiClient.post(`/whatsapp/send-excel`, {
      messages,
    });

    return res;
  } catch (error) {
    console.error("فشل في إرسال الرسائل:", error);
    throw error;
  }
};


// جلب جهات الاتصال
export const fetchContacts = async () => {
  try {
    const response = await apiClient.get("/contacts");
    console.log("جهات اتصالي", response.data.contacts);
    return response.data.contacts; // ✅ التعديل هنا
  } catch (error) {
    console.error("فشل في جلب جهات الاتصال:", error);
    throw error;
  }
};