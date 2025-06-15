"use client";

import React, { useRef } from "react";
import useTranslation from "@/hooks/useTranslation";
import Button from "@/components/atoms/Button";
import { Eye } from "lucide-react";

interface FileUploaderProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  accept?: string;
  label?: string; // نص الزر القابل للترجمة
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onChange,
  disabled = false,
  accept = ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  label, // ← تمرير من الصفحة أو props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // ← إذا لم يتم تمرير label، نستخدم القيمة الافتراضية من الترجمة هنا
  const defaultLabel = t("choose_file");

  return (
    <div className="space-y-2">
      {/* زر مخصص */}
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        icon={<Eye className="w-4 h-4" />}
        iconPosition="left"
      >
        {label || defaultLabel} {/* ← الأولوية لـ label ثم الافتراضي */}
      </Button>

      {/* حقل الملف المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        hidden
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;