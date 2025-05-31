import {apiClient} from "./apiClient"; 

export type Person = {
  name: string;
  phone_number: string;
};

export type TemplatePayload = {
  name: string;
  phone_numbers: Person[];
};

export type PersonFromAPI = {
  _id: string;
  name: string;
  phone_number: string; // ← اسم الحقل كما في API
  created_at?: string;
};

export type TemplateFromAPI = {
  [x: string]: any;
  _id: string;
  name: string;
  contacts: PersonFromAPI[];
  account: string;
  __v: number;
};

// انشاء دفتر عناوين
export const saveTemplateToAPI = async (template: TemplatePayload) => {
  try {
    const response = await apiClient.post("/groups", template);
    return response.data;
  } catch (error) {
    console.error("فشل في حفظ القالب عبر API:", error);
    throw error;
  }
};

// جلب دفاتر العناوين
export const fetchTemplatesFromAPI = async (): Promise<TemplateFromAPI[]> => {
  try {
    const response = await apiClient.get("/groups");
    return response.data || [];
  } catch (error) {
    console.error("فشل في جلب القوالب:", error);
    return [];
  }
};

// حذف دفتر عناوين
export const deleteTemplateFromAPI = async (_id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/groups/${_id}`);
    return true;
  } catch (error) {
    console.error("فشل في حذف القالب:", error);
    return false;
  }
};


// تعديل دفتر عناوين
export const updateTemplateToAPI = async (
  id: string,
  template: TemplatePayload
) => {
    console.log(template)
  try {
    const response = await apiClient.patch(`/groups/${id}`, template);
    return response.data;
  } catch (error) {
    console.error("فشل في تحديث القالب عبر API:", error);
    throw error;
  }
};