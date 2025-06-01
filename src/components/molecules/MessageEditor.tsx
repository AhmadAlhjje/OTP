// molecules/MessageEditor.tsx
import React from "react";
import {Textarea} from "@/components/atoms/textarea";
import TemplateSelector from "./TemplateSelector";

// Icons from lucide-react
import  IconWrapper  from "@/components/atoms/IconWrapper"; // ✅ تم استيراد IconWrapper
import { MessageSquare, FileText } from "lucide-react";    // ✅ استيراد الرموز الناقصة

interface MessageEditorProps {
  message: string;
  setMessage: (msg: string) => void;
  isTemplateMode: boolean;
  setIsTemplateMode: (val: boolean) => void;
  selectedTemplate: any;
  templates: any[];
  setTemplates: (t: any[]) => void;
  setSelectedTemplate: (t: any) => void;
  templatesLoading: boolean;
  setShowTemplateDropdown: (val: boolean) => void;
  handleTemplateSelect: (template: any) => void;
}

const MessageEditor: React.FC<MessageEditorProps> = ({
  message,
  setMessage,
  isTemplateMode,
  setIsTemplateMode,
  selectedTemplate,
  templates,
  templatesLoading,
  setSelectedTemplate,
  setShowTemplateDropdown,
  handleTemplateSelect,
}) => {
  const toggleTemplateMode = () => {
    setIsTemplateMode(!isTemplateMode);
    if (!isTemplateMode) {
      setMessage("");
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            {/* استخدام IconWrapper و MessageSquare بعد الاستيراد */}
            <IconWrapper icon={MessageSquare} size={20} color="#8B5CF6" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              محتوى الرسالة
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isTemplateMode ? "اختر قالب رسالة" : "اكتب رسالتك"}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={isTemplateMode} onChange={toggleTemplateMode} className="sr-only" />
          <div className={`relative w-14 h-7 transition-colors duration-300 rounded-full ${isTemplateMode ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ease-in-out" style={{ transform: isTemplateMode ? 'translateX(28px)' : 'translateX(0)' }}>
              {/* استخدام IconWrapper و FileText بعد الاستيراد */}
              <IconWrapper icon={FileText} size={12} color="#8B5CF6" />
            </div>
          </div>
        </label>
      </div>

      {isTemplateMode ? (
        <TemplateSelector
          templates={templates}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          message={message}
          setMessage={setMessage}
          loading={templatesLoading}
        />
      ) : (
        <div>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا... يمكنك استخدام الإيموجي والنصوص الطويلة"
            className="min-h-[180px] resize-none border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-base leading-relaxed"
          />
          <div className="flex justify-between items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{message.length} حرف</span>
            {message.length > 0 && (
              <span className="text-green-600 dark:text-green-400">✓ جاهز للإرسال</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageEditor;