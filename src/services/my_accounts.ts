import axios from "axios";
import { apiClient } from "./apiClient";
import Cookies from "js-cookie";

// جلب الحسابات المرتبطة بالمستخدم من الـ API
// شغال
export const getWhatsappAccounts = async () => {
  try {
    const response = await apiClient.get(`accounts/get-available-accounts`);

    // تنسيق البيانات إذا لزم الأمر
    return response.data.map((account: any) => ({
      id: account._id,
      name: account.name,
      phone: account.phone_number,
    }));
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    return [];
  }
};

// حذف حساب WhatsApp حسب الـ ID
export const deleteWhatsappAccount = async (id: string) => {
  try {
    const response = await apiClient.delete(`/accounts`);
    if (response.status === 200) {
      console.log(`Account with id ${id} deleted successfully`);
    } else {
      throw new Error("Failed to delete account");
    }
  } catch (error) {
    console.error("Error deleting account:", error);
    console.log(`Pretend deleting account with id ${id}`);
  }
};

// حفظ الحساب النشط
// شغال
export const setActiveAccount = async (accountId: string) => {
  try {
    const res = await apiClient.post(`auth/select-account`, {
      accountId,
    });
    const access_token = res.data?.access_token;
    const refresh_token = res.data?.refresh_token;

    if (access_token) {
      Cookies.set("access_token", access_token, { expires: 7 }); // لمدة 7 أيام مثلًا
      Cookies.set("refresh_token", refresh_token, { expires: 30 }); // لمدة 30 أيام مثلًا
    } else {
      console.warn("لم يتم العثور على توكن جديدة في الاستجابة.");
    }
  } catch (error) {
    console.error("فشل في حفظ الحساب النشط:", error);
  }
};

// جلب الحساب النشط
// شغال
export const getActiveAccount = async () => {
  try {
    const token = Cookies.get("access_token");

    if (!token) {
      console.warn("لا يوجد access_token في الكوكيز.");
      return null;
    }

    // فك تشفير التوكن JWT (نأخذ الجزء الأوسط فقط)
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const accountId = payload.account_id;

    if (!accountId) {
      console.warn("account_id غير موجود في التوكن.");
      return null;
    }

    return { id: accountId }; // يمكن أيضًا استدعاء API هنا إذا احتجت مزيدًا من التفاصيل

  } catch (error) {
    console.error("فشل في جلب الحساب النشط من التوكن:", error);
    return null;
  }
};
