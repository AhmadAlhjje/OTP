// // @/components/molecules/EditMessageModal.tsx
// "use client";
// import React from "react";

// interface EditMessageModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   messageData: {
//     id: string;
//     number: string;
//     message: string;
//     scheduledAt: string;
//   };
//   onSave: (updatedData: { number: string; message: string; scheduledAt: string }) => void;
// }

// const EditMessageModal: React.FC<EditMessageModalProps> = ({
//   isOpen,
//   onClose,
//   messageData,
//   onSave,
// }) => {
//   const [number, setNumber] = React.useState(messageData.number || "");
//   const [message, setMessage] = React.useState(messageData.message || "");
//   const [scheduledAt, setScheduledAt] = React.useState(
//     messageData.scheduledAt
//       ? new Date(messageData.scheduledAt).toISOString().slice(0, 16)
//       : ""
//   );

//   if (!isOpen) return null;

//   const handleSave = () => {
//     onSave({ number, message, scheduledAt });
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 animate-in zoom-in">
//         <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">تعديل الرسالة</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               رقم المستقبل
//             </label>
//             <input
//               type="text"
//               value={number}
//               onChange={(e) => setNumber(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               محتوى الرسالة
//             </label>
//             <textarea
//               rows={3}
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
//             ></textarea>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               وقت الإرسال
//             </label>
//             <input
//               type="datetime-local"
//               value={scheduledAt}
//               onChange={(e) => setScheduledAt(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition"
//           >
//             إلغاء
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition"
//           >
//             حفظ التغييرات
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditMessageModal;