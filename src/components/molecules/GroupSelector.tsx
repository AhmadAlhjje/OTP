// molecules/GroupSelector.tsx
// يسمح باختيار مجموعة من قائمة المجموعات المتاحة وعرضها

import React from "react";
import Button from "@/components/atoms/Button";
import IconWrapper from "@/components/atoms/IconWrapper";
import { ChevronDown, CheckCircle2, X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

// Interface للمجموعة
interface GroupFromAPI {
  _id: string;
  name: string;
  description?: string;
  membersCount?: number;
}

// Interface للـ props
interface GroupSelectorProps {
  groups: GroupFromAPI[];
  selectedGroups: GroupFromAPI[];
  setSelectedGroups: (groups: GroupFromAPI[]) => void;
  loading?: boolean;

  // هذه الخواص يتم تمريرها من الصفحة الأم
  showDropdown?: boolean;
  setShowDropdown?: (val: boolean) => void;
  handleSelect?: (group: GroupFromAPI) => void;
  handleRemove?: (id: string) => void;
}

const GroupSelector: React.FC<GroupSelectorProps> = ({
  groups,
  selectedGroups,
  setSelectedGroups,
  loading = false,
  showDropdown = false,
  setShowDropdown = () => {},
  handleSelect = () => {},
  handleRemove = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* زر اختيار المجموعة */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={loading}
          className="w-full p-4 border-2 border-green-200 dark:border-green-700 rounded-xl focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-right flex items-center justify-between transition-all"
        >
          <span>
            {loading ? t("loading_groups") : t("select_group_to_send")}
          </span>
          <IconWrapper
            icon={ChevronDown}
            size={20}
            color="#10B981"
            className={`transition-transform ${showDropdown ? "rotate-180" : ""}`}
          />
        </button>

        {/* القائمة المنسدلة للمجموعات */}
        {showDropdown && !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
            {groups.length > 0 ? (
              groups.map((group) => (
                <button
                  key={group._id}
                  type="button"
                  onClick={() => handleSelect(group)}
                  disabled={selectedGroups.some((g) => g._id === group._id)}
                  className="w-full p-4 text-right hover:bg-green-50 dark:hover:bg-green-900/20 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {group.name}
                    </p>
                    {group.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {group.description}
                      </p>
                    )}
                    {group.membersCount && (
                      <span className="inline-block mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                        {group.membersCount} {t("members")}
                      </span>
                    )}
                    {selectedGroups.some((g) => g._id === group._id) && (
                      <IconWrapper
                        icon={CheckCircle2}
                        size={16}
                        color="#059669"
                        className="inline-block mr-2"
                      />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t("no_groups_available")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* عرض المجموعات المختارة */}
      {selectedGroups.length > 0 && (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {selectedGroups.map((group) => (
            <div
              key={group._id}
              className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
            >
              <div>
                <span className="text-sm font-medium">{group.name}</span>
                {group.membersCount && (
                  <span className="text-xs text-gray-500 mr-2">
                    ({group.membersCount} {t("members_count")}, {t("members")})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(group._id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <IconWrapper icon={X} size={16} color="#EF4444" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupSelector;