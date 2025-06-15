// app/(dashboard)/excel-sender/page.tsx
"use client";

import React, { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import { sendWhatsappMessage1 } from "@/services/message-service";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/useToast";
import Table from "@/components/molecules/Table";
import FileUploader from "@/components/atoms/FileUploader";
import Button from "@/components/atoms/Button";
import { Eye } from "lucide-react";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

interface ExcelRow {
  [key: string]: string | number;
}

const ExcelMessageSenderPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<ExcelRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // --- معالجة رفع الملف ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const json: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (json.length < 2) {
          setError(t("excel_empty_file"));
          setLoading(false);
          return;
        }

        const headers = json[0].map((h: any) => h.toString().trim());
        const rows = json
          .slice(1)
          .filter((row) =>
            row.some((cell: any) => cell !== undefined && cell !== "")
          );

        const parsedData = rows.map((row) => {
          const obj: Record<string, string> = {};
          headers.forEach((header: any, i: number) => {
            const value = row[i]?.toString().trim() || "_";
            obj[header] = value;
          });
          return obj;
        });

        setData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(t("excel_invalid_format"));
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  // --- إرسال الرسائل ---
  const handleSendMessages = async () => {
    if (!data.length) return;

    setLoading(true);
    setError(null);

    try {
      const phoneNumbers = data
        .map((row) => row["الرقم"]?.toString().trim())
        .filter((num) => num && num.length >= 10);

      if (!phoneNumbers.length) {
        setError(t("no_valid_numbers_found"));
        setLoading(false);
        return;
      }

      // صياغة الرسالة لكل سطر
      const messageLines = data.map((row) => {
        const lines = Object.entries(row)
          .filter(([key]) => key !== "الرقم")
          .map(([key, value]) => `${key} : ${value}`);

        return lines.join("\n");
      });

      const fullMessage = messageLines.join("\n\n"); // رسالة واحدة تحتوي على جميع البيانات
      const res = await sendWhatsappMessage1({
        to: phoneNumbers,
        message: fullMessage,
      });

      if (res.status === 201) {
        showToast(t("toastmessage_sent"), "success");
        setData([]);
      } else {
        setError(t("send_failed_with_reason"));
      }
    } catch (err) {
      showToast(t("failed_to_send_messages"),"error");
    } finally {
      setLoading(false);
    }
  };

  // --- عرض الجدول ---
  //   const renderTable = () => {
  //     if (!data.length) return null;

  //     const headers = Object.keys(data[0]);

  //     return (
  //       <div className="overflow-x-auto mt-6">
  //         <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden text-sm">
  //           <thead className="bg-gray-100 dark:bg-gray-700">
  //             <tr>
  //               {headers.map((header, idx) => (
  //                 <th
  //                   key={idx}
  //                   className="px-4 py-2 text-left text-gray-700 dark:text-gray-300"
  //                 >
  //                   {header}
  //                 </th>
  //               ))}
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {data.map((row, i) => (
  //               <tr
  //                 key={i}
  //                 className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
  //               >
  //                 {Object.values(row).map((val, j) => (
  //                   <td key={j} className="px-4 py-2 text-gray-800 dark:text-gray-200">
  //                     {val}
  //                   </td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     );
  //   };

  return (
    <div className="p-6 w-full  space-y-6 min-h-screen bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* العنوان */}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {t("upload_excel_file")}
      </h1>

      {/* رفع الملف */}
      <FileUploader onChange={handleFileUpload} disabled={loading} label={t("choose_file")} />

      {loading && (
        <LoadingSpinner
          message={t("processing_file")}
          size="md"
          color="green"
        />
      )}
      {error && <p className="text-red-500">{error}</p>}

      {/* جدول العرض */}
      {/* {renderTable()} */}

      {/* جدول العرض */}
      {data.length > 0 && (
        <div className="mt-6">
          <Table
            columns={Object.keys(data[0]).map((key) => ({
              key,
              label: key,
              sortable: true,
              align: "left",
            }))}
            data={data}
            striped
            hoverable
            emptyMessage={t("no_data_available")}
            loading={loading}
          />
        </div>
      )}

      {/* زر الإرسال */}
      {data.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSendMessages}
            disabled={loading}
            variant="primary"
            size="md"
            loading={loading}
            iconPosition="left"
            // icon={<Eye className="w-4 h-4" />}
          >
            {loading ? t("sending") : t("send_messages")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExcelMessageSenderPage;
