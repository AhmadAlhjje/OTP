import { AutoReply } from "@/types/auto-reply";
import { apiClient } from "./apiClient";

export const fetchAutoRepliesFromAPI = async (): Promise<AutoReply[]> => {
  try {
    const response = await apiClient.get("/rules");
    // console.log(response.data)
    return response.data || [];
  } catch (error) {
    console.error("فشل في جلب الردود التلقائية:", error);
    return [];
  }
};

export const addAutoReplyToAPI = async (
  replies: Omit<AutoReply, "_id">[] // مصفوفة من الردود
): Promise<AutoReply[] | null> => {
  try {
    const response = await apiClient.post("/rules", replies);
    return response.data;
  } catch (error) {
    console.error("فشل في إضافة الرد عبر API:", error);
    return null;
  }
};

export const updateAutoReplyOnAPI = async (
  id: string,
  replies: Partial<AutoReply>[] // مصفوفة من الردود
): Promise<AutoReply | null> => {
  try {
    const response = await apiClient.patch(`/rules/${id}`, replies);
    return response.data;
  } catch (error) {
    console.error(`فشل في تحديث الرد #${id} عبر API:`, error);
    return null;
  }
};

export const deleteAutoReplyFromAPI = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/rules/${id}`);
    return true;
  } catch (error) {
    console.error(`فشل في حذف الرد #${id}:`, error);
    return false;
  }
};