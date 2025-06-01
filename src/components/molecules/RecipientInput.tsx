// molecules/RecipientInput.tsx
// يُظهر حقل إدخال رقم الهاتف مع زر الإضافة وعرض الأرقام المختارة

import React from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import IconWrapper from "@/components/atoms/IconWrapper";
import { X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface RecipientInputProps {
  currentNumber: string;
  setCurrentNumber: (val: string) => void;
  recipientNumbers: string[];
  setRecipientNumbers: (nums: string[]) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAddNumber: () => void;
}

const RecipientInput: React.FC<RecipientInputProps> = ({
  currentNumber,
  setCurrentNumber,
  recipientNumbers,
  setRecipientNumbers,
  handleKeyPress,
  handleAddNumber,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-3">
        <div className="relative w-full">
          <IconWrapper icon={X} size={20} color="#9CA3AF" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            value={currentNumber}
            onChange={(e) => setCurrentNumber(e.target.value)}
            placeholder={t("example_phone_number")}
            onKeyPress={handleKeyPress}
            className="flex-1 h-12 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-xl pl-10"
          />
        </div>
        <Button onClick={handleAddNumber} variant="success" className="h-12 px-6">
          {t("add")}
        </Button>
      </div>

      {recipientNumbers.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto mt-2">
          {recipientNumbers.map((number) => (
            <div key={number} className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <span className="text-sm font-medium">{number}</span>
              <button onClick={() => setRecipientNumbers(recipientNumbers.filter(n => n !== number))}>
                <IconWrapper icon={X} size={16} color="#EF4444" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RecipientInput;