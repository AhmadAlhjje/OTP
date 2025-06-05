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