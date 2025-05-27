import { apiClient } from "./apiClient";

// Types
export type Person = {
  name: string;
  phone_number: string;
};

// ✅ تم تعديل هذا النوع
export type TemplatePayload = {
  name: string;
  content: string; // ← هنا التغيير: content ليس مصفوفة بل نص
};

export type APITemplateResponse = {
  templates: APITemplate[];
  total: number;
};

export type APITemplate = {
  _id: string;
  name: string;
  content: string;
  type?: string;
  tags?: string[];
  contacts?: Person[];
  account: string;
  isDefault: boolean;
  created_at: string;
  updated_at?: string;
  __v?: number;
};

/**
 * إرسال قالب جديد إلى السيرفر
 */
export const saveTemplateToAPI = async (template: TemplatePayload) => {
  try {
    const response = await apiClient.post("/templates", template);
    return response.data;
  } catch (error) {
    console.error("فشل في حفظ القالب عبر API:", error);
    throw error;
  }
};

/**
 * جلب جميع القوالب من السيرفر
 */
export const fetchTemplatesFromAPI = async (): Promise<APITemplate[]> => {
  try {
    const response = await apiClient.get("/templates");
    const data: APITemplateResponse = response.data;
    return data.templates || [];
  } catch (error) {
    console.error("فشل في جلب القوالب:", error);
    return [];
  }
};

/**
 * تعديل قالب موجود على السيرفر
 */
export const updateTemplateToAPI = async (
  id: string,
  template: Partial<TemplatePayload>
) => {
  try {
    const response = await apiClient.patch(`/templates/${id}`, template);
    return response.data;
  } catch (error) {
    console.error("فشل في تحديث القالب عبر API:", error);
    throw error;
  }
};

/**
 * حذف قالب من السيرفر
 */
export const deleteTemplateFromAPI = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/templates/${id}`);
    return true;
  } catch (error) {
    console.error("فشل في حذف القالب:", error);
    return false;
  }
};