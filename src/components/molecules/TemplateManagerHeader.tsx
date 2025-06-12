// TemplateManagerHeader.tsx
import React from "react";
import Button from "@/components/atoms/Button";
import { Users } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface TemplateManagerHeaderProps {
  activeAccount: any;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const TemplateManagerHeader: React.FC<TemplateManagerHeaderProps> = ({
  activeAccount,
  showForm,
  setShowForm,
  showToast,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("templatePeoplePagetitle")}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("manage_people_and_groups_lists")}
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (!activeAccount) {
                showToast(t("select_whatsapp_account_first"), "error");
                return;
              }
              setShowForm(!showForm);
            }}
            className={`flex items-center gap-2 ${
              showForm
                ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } rounded-full px-4 py-2 transition-all`}
          >
            {showForm ? (
              <>{t("cancel")}</>
            ) : (
              <>{t("add_new_template")}</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateManagerHeader;