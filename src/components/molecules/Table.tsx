"use client";
import React, { useCallback, useState } from "react";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import { ChevronDown, Search, Check, Eye } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

// --- أنواع البيانات ---
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  searchable?: boolean;
  filterable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
  loading?: boolean;
}

// --- المكون الرئيسي للجدول ---
const Table: React.FC<TableProps> = ({
  columns,
  data,
  striped = true,
  hoverable = true,
  emptyMessage = "لا توجد بيانات للعرض",
  loading = false,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useTranslation();

  // --- معالجة الترتيب ---
  const handleSort = useCallback(
    (columnKey: string) => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      if (sortColumn === columnKey) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(columnKey);
        setSortDirection("asc");
      }
    },
    [sortColumn]
  );

  // --- تحديد الصفوف ---
  const toggleRowSelection = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const selectAllRows = () => {
    setSelectedRows(
      selectedRows.length === filteredData.length
        ? []
        : filteredData.map((_, index) => index)
    );
  };

  // --- البحث والفرز ---
  const filteredData = React.useMemo(() => {
    let result = [...data];
    // البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === "string" &&
            value.toString().toLowerCase().includes(query)
        )
      );
    }
    // الترتيب
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return sortDirection === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
          ? 1
          : -1;
      });
    }
    return result;
  }, [data, searchQuery, sortColumn, sortDirection]);

  // --- حالة عدم وجود بيانات ---
  const EmptyRow = () => (
    <tr>
      <td colSpan={columns.length + 1} className="p-16">
        <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-105 transition-all duration-300">
            <Search className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-sm text-center max-w-sm leading-relaxed">
            {searchQuery
              ? `${t("no_results_match")}"${searchQuery}". ${t(
                  "try_different_search"
                )}`
              : t("no_data_available")}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            >
              {t("clear_search")}
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="w-full space-y-6 p-1">
      {/* الجدول الرئيسي */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform hover:shadow-3xl transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* رأس الجدول */}
            <thead className="bg-gradient-to-r from-gray-50 via-emerald-50 to-teal-50 dark:from-gray-700 dark:via-emerald-900/20 dark:to-teal-900/20">
              <tr className="border-b border-emerald-100 dark:border-emerald-800">
                {/* الأعمدة */}
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    className={`px-6 py-5 text-right font-bold text-gray-800 dark:text-gray-200 ${
                      column.width || "min-w-[150px]"
                    }`}
                    style={{
                      textAlign: column.align || "right",
                      width: column.width,
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div
                      className={`flex items-center gap-3 animate-in slide-in-from-left duration-500 ${
                        column.align === "center"
                          ? "justify-center"
                          : column.align === "left"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <span className="text-sm font-semibold tracking-wide">
                        {column.label}
                      </span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-125 ${
                            sortColumn === column.key
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 shadow-md"
                              : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          }`}
                        >
                          <div
                            className={`transition-transform duration-200 ${
                              sortColumn === column.key &&
                              sortDirection === "desc"
                                ? "rotate-180"
                                : ""
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* جسم الجدول */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <EmptyRow />
              ) : (
                filteredData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`
                      transition-all duration-300 group cursor-pointer animate-in slide-in-from-bottom
                      ${
                        selectedRows.includes(rowIndex)
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-r-4 border-emerald-500 shadow-sm"
                          : ""
                      }
                      ${
                        striped &&
                        rowIndex % 2 === 0 &&
                        !selectedRows.includes(rowIndex)
                          ? "bg-gray-50/30 dark:bg-gray-800/30"
                          : ""
                      }
                      ${
                        hoverable
                          ? "hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:shadow-lg hover:scale-[1.01] hover:border-l-4 hover:border-emerald-400"
                          : ""
                      }
                    `}
                    style={{ animationDelay: `${rowIndex * 50}ms` }}
                    onClick={() => toggleRowSelection(rowIndex)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 text-gray-800 dark:text-gray-200"
                        style={{ textAlign: column.align || "right" }}
                      >
                        <div className="flex items-center gap-3">
                          {React.isValidElement(row[column.key]) ? (
                            row[column.key]
                          ) : (
                            <span className="text-sm font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                              {String(row[column.key] || "—")}
                            </span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* شريط المعلومات السفلي */}
        {!loading && filteredData.length > 0 && (
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-emerald-50/30 dark:from-gray-800 dark:to-emerald-900/10 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">
                    {t("showing")}{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {filteredData.length}
                    </span>{" "}
                    {t("of")}{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {data.length}
                    </span>{" "}
                    {t("item")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {searchQuery && (
                  <div className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full">
                    <Search className="h-3 w-3" />
                    <span className="text-xs font-semibold">
                      {t("search_results")} {filteredData.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
