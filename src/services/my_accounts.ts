import axios from 'axios';
import { extractUserIdFromToken } from './apiClient';



// جلب الحسابات المرتبطة بالمستخدم من الـ API
export const getWhatsappAccounts = async () => {
  const userId = extractUserIdFromToken();
  if (!userId) {
    console.error('User ID not found in token');
    return [];
  }

  try {
    const response = await axios.get(
      `https://whatsapp-project-gamma.vercel.app/accounts/user/${userId}`
    );

    // تنسيق البيانات إذا لزم الأمر
    return response.data.map((account: any) => ({
      id: account._id,
      name: account.name,
      phone: account.phone_number,
    }));
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    return [];
  }
};

// حذف حساب WhatsApp حسب الـ ID
export const deleteWhatsappAccount = async (id: string) => {
  try {
    const response = await axios.delete(
      `https://whatsapp-project-gamma.vercel.app/accounts/${id}`
    );

    if (response.status === 200) {
      console.log(`Account with id ${id} deleted successfully`);
    } else {
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    console.log(`Pretend deleting account with id ${id}`);
  }
};
