// molecules/SendButton.tsx
// زر إرسال الرسالة (فوري أو مجدول) مع مؤشر التحميل

import React from "react";
import Button from "@/components/atoms/Button";
import IconWrapper from "@/components/atoms/IconWrapper";
import { Send, Clock, Sparkles } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface SendButtonProps {
  isLoading: boolean;
  isScheduled: boolean;
  isTemplateMode: boolean;
  onClick: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({
  isLoading,
  isScheduled,
  isTemplateMode,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-4 px-8 text-white rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-semibold ${
        isScheduled
          ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      }`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
          <span>{isScheduled ? t("scheduling_message") : t("sending_message")}</span>
        </>
      ) : (
        <>
          {isScheduled && <IconWrapper icon={Clock} size={10} />}
          <span>
            {isScheduled ? t("schedule_message") : t("send_message")}
            {isTemplateMode && ` (${t("template")})`}
          </span>
          {isScheduled && <IconWrapper icon={Sparkles} size={18} className="animate-pulse" />}
        </>
      )}
    </Button>
  );
};

export default SendButton;