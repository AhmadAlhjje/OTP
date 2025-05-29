"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import useLanguage from "@/hooks/useLanguage";
import Table, { TableColumn, TableRow } from "@/components/molecules/Table";
import EditButton from "@/components/common/EditButton";
import DeleteButton from "@/components/common/DeleteButton";

const ScheduledMessagesPage = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  // --- بيانات تجريبية ---
  const mockData: TableRow[] = [
    {
      id: "1",
      number: "+963987654321",
      message: "مرحباً! هذه رسالة تجريبية.",
      scheduledAt: "2025-04-05T14:30:00Z",
    },
    {
      id: "2",
      number: "+963912345678",
      message: "تذكير بالموعد الطبي غداً الساعة 10 صباحاً.",
      scheduledAt: "2025-04-06T10:00:00Z",
    },
    {
      id: "3",
      number: "+963998877665",
      message: "السلام عليكم، تم تسليم الشحنة الخاصة بك.",
      scheduledAt: "2025-04-07T09:15:00Z",
    },
  ];

  // --- حالة البيانات ---
  const [scheduledMessages, setScheduledMessages] = useState<TableRow[]>(mockData);

  // --- تنسيق التاريخ ---
  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- حذف رسالة ---
  const handleDeleteMessage = async (messageId: string) => {
    try {
      setScheduledMessages((prev) =>
        prev.filter((msg) => msg.id !== messageId)
      );
      showToast("تم حذف الرسالة بنجاح", "success");
    } catch (error) {
      showToast("فشل في حذف الرسالة", "error");
    }
  };

  // --- أعمدة الجدول ---
  const columns: TableColumn[] = [
    { key: "id", label: "تحديد", sortable: false, align: "center", width: "60px" },
    { key: "number", label: "رقم المستقبل", sortable: true, align: "center" },
    { key: "message", label: "محتوى الرسالة", sortable: true },
    { key: "scheduledAt", label: "وقت الإرسال", sortable: true, align: "center" },
    { key: "actions", label: "الإجراءات", align: "center" },
  ];

  // --- تحويل البيانات ---
  const formattedData = scheduledMessages.map((msg) => ({
    ...msg,
    scheduledAt: formatScheduledTime(msg.scheduledAt),
    actions: (
      <div className="flex gap-2">
        <EditButton onClick={() => console.log("edit")} />
        <DeleteButton onClick={() => handleDeleteMessage(msg.id)} />
      </div>
    ),
  }));

  return (
    <div className="p-6 w-full space-y-8 min-h-screen bg-gradient-to-br from-white via-green-50/30 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        الرسائل المجدولة
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        عرض وتعديل الرسائل المجدولة
      </p>

      {/* جدول الرسائل */}
      <Table
        columns={columns}
        data={formattedData}
        searchable={true}
        filterable={true}
        striped={true}
        hoverable={true}
        emptyMessage="لا توجد رسائل مجدولة"
        loading={false}
      />
    </div>
  );
};

export default ScheduledMessagesPage;