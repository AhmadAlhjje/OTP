import { apiClient } from './apiClient';
import axios from 'axios';


// دالة لجلب الحسابات من API 
export const getWhatsappAccounts = async () => {
  try {
    const response = await axios.get(`${apiClient}/whatsapp-accounts`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [
      { id: '1', name: 'Account One', phone: '+1234567890' },
      { id: '2', name: 'Account Two', phone: '+9876543210' },
    ];
  }
}

// دالة لحذف حساب باستخدام API  
export const deleteWhatsappAccount = async (id: string) => {
  try {
    // استدعاء الـ API لحذف الحساب باستخدام الـ ID
    const response = await axios.delete(`${apiClient}/whatsapp-accounts/${id}`);
    
    if (response.status === 200) {
      console.log(`Account with id ${id} deleted successfully`);
    } else {
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error(error);
    // تسجيل رسالة في حال فشل الحذف
    console.log(`Pretend deleting account with id ${id}`);
  }
}