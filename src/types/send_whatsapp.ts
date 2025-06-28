// Interface للحساب النشط
export interface ActiveAccount {
  name: string;
}
// Interface للمجموعات
export interface GroupFromAPI {
  _id: string;
  name: string;
  description?: string;
  membersCount?: number;
}

export interface MediaFile {
  file: File;
  type: 'image' | 'video';
  preview: string;
  id: string;
}

export interface MessageData {
  to: string[];
  message: string;
  media?: MediaFile[];
}

export interface SendMessageParams {
  to: string[];
  message: string;
  photos?: File[];
  videos?: File[];
} 