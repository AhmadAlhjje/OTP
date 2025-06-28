"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { TableColumn, TableRow } from "@/types/auto-reply";

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  striped?: boolean;     // ← جديد
  hoverable?: boolean;
  filterable?: boolean;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyMessage = "لا توجد بيانات",
  searchable = true,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search filtering
    if (searchQuery && searchable) {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === "string" && value.toLowerCase().includes(query)
        )
      );
    }

    // Sorting
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
  }, [data, searchQuery, sortColumn, sortDirection, searchable]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث في الردود التلقائية..."
            className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all duration-200"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-700 dark:to-emerald-900/20">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-gray-200"
                    style={{
                      textAlign: column.align || "right",
                      width: column.width,
                    }}
                  >
                    <div
                      className={`
                      flex items-center gap-2
                      ${
                        column.align === "center"
                          ? "justify-center"
                          : column.align === "left"
                          ? "justify-start"
                          : "justify-end"
                      }
                    `}
                    >
                      <span>{column.label}</span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className={`
                            p-1 rounded transition-colors duration-200
                            ${
                              sortColumn === column.key
                                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30"
                                : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                            }
                          `}
                        >
                          <ChevronDown
                            className={`
                              w-4 h-4 transition-transform duration-200
                              ${
                                sortColumn === column.key &&
                                sortDirection === "desc"
                                  ? "rotate-180"
                                  : ""
                              }
                            `}
                          />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">{emptyMessage}</p>
                      {searchQuery && (
                        <p className="text-sm">
                          لا توجد نتائج تطابق "{searchQuery}"
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors duration-200"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4"
                        style={{ textAlign: column.align || "right" }}
                      >
                        {React.isValidElement(row[column.key]) ? (
                          row[column.key]
                        ) : (
                          <span className="text-gray-800 dark:text-gray-200">
                            {String(row[column.key] || "—")}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Info */}
        {!loading && filteredData.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                عرض {filteredData.length} من أصل {data.length} عنصر
              </span>
              {searchQuery && (
                <span className="text-emerald-600 dark:text-emerald-400">
                  نتائج البحث: {filteredData.length}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
