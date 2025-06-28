import { apiClient } from "./apiClient";

// ارسال رسالة واتساب مع دعم الصور والملفات
export const sendWhatsappMessage1 = async ({
  to,
  message,
  photo,
}: {
  to: string[];
  message: string;
  photo?: File | null;
}) => {
  // console.log("to", to);
  // console.log("message", message);
  // console.log("photo", photo);
  
  try {
    const formData = new FormData();
    
    // إضافة الأرقام (multiple values)
    to.forEach((number) => {
      formData.append("to[]", number);
    });
    
    // إضافة الرسالة
    formData.append("message", message);
    
    // إضافة الصورة إذا كانت موجودة
    if (photo) {
      formData.append("photo", photo);
    }

    const res = await apiClient.post(`/whatsapp/send-message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res;
  } catch (error) {
    console.error("فشل في إرسال الرسالة:", error);
    throw error;
  }
};

// ارسال رسائل مجمعة مع دعم الصور
export const sendWhatsappMessagesBatch = async (
  messages: { number: string; message: string; photo?: File | null }[]
) => {
  try {
    const formData = new FormData();
    
    messages.forEach((msg, index) => {
      formData.append(`messages[${index}][number]`, msg.number);
      formData.append(`messages[${index}][message]`, msg.message);
      
      if (msg.photo) {
        formData.append(`messages[${index}][photo]`, msg.photo);
      }
    });

    const res = await apiClient.post(`/whatsapp/send-excel`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
    // console.log("جهات اتصالي", response.data.contacts);
    return response.data.contacts;
  } catch (error) {
    console.error("فشل في جلب جهات الاتصال:", error);
    throw error;
  }
};


// ✅ تعديل دالة إرسال الرسائل المجدولة لدعم FormData والصور
export const sendWhatsappMessage = async ({
  to,
  message,
  scheduledAt,
  photo,
}: {
  to: string[];
  message: string;
  scheduledAt: string;
  photo?: File | null;
}) => {
  // console.log("Scheduled message data:", { to, message, scheduledAt, photo });

  try {
    const formData = new FormData();
    
    // إضافة الأرقام (multiple values)
    to.forEach((number) => {
      formData.append("to[]", number);
    });
    
    // إضافة الرسالة
    formData.append("message", message);
    
    // إضافة وقت الجدولة
    formData.append("scheduledAt", scheduledAt);
    
    // إضافة الصورة إذا كانت موجودة
    if (photo) {
      formData.append("photo", photo);
    }

    const res = await apiClient.post(`/whatsapp/schedule-message`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res;
  } catch (error) {
    console.error("فشل في جدولة الرسالة:", error);
    throw error;
  }
};

// دالة إضافية لجدولة رسائل متعددة مع صور
export const sendWhatsappMessagesBatchScheduled = async (
  messages: { 
    numbers: string[]; 
    message: string; 
    scheduledAt: string;
    photo?: File | null;
  }[]
) => {
  try {
    const formData = new FormData();
    
    messages.forEach((msg, index) => {
      // إضافة الأرقام لكل رسالة
      msg.numbers.forEach((number, numberIndex) => {
        formData.append(`messages[${index}][numbers][${numberIndex}]`, number);
      });
      
      formData.append(`messages[${index}][message]`, msg.message);
      formData.append(`messages[${index}][scheduledAt]`, msg.scheduledAt);
      
      if (msg.photo) {
        formData.append(`messages[${index}][photo]`, msg.photo);
      }
    });

    const res = await apiClient.post(`/whatsapp/schedule-batch`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res;
  } catch (error) {
    console.error("فشل في جدولة الرسائل المجمعة:", error);
    throw error;
  }
};