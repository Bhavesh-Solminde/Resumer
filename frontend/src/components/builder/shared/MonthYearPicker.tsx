import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../../../lib/utils";

interface DateValue {
  month: number;
  year: number;
}

interface MonthYearValue {
  from: DateValue | null;
  to: DateValue | "Present" | null;
}

interface MonthYearPickerProps {
  value?: MonthYearValue;
  onChange: (value: MonthYearValue) => void;
  allowPresent?: boolean;
  onClose?: () => void;
  className?: string;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value = { from: null, to: null },
  onChange,
  allowPresent = true,
  onClose,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"from" | "to">("from");
  const [view, setView] = useState<"year" | "month">("year");
  const [yearRange, setYearRange] = useState(() => {
    const currentYear = new Date().getFullYear();
    return { start: currentYear - 11, end: currentYear };
  });
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentValue = activeTab === "from" ? value.from : value.to;
  const isPresent = activeTab === "to" && value.to === "Present";

  useEffect(() => {
    if (
      currentValue &&
      currentValue !== "Present" &&
      typeof currentValue === "object" &&
      currentValue.year
    ) {
      setSelectedYear(currentValue.year);
    }
  }, [activeTab, currentValue]);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setView("month");
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate: DateValue = { month: monthIndex, year: selectedYear! };

    if (activeTab === "from") {
      onChange({ ...value, from: newDate });
      setActiveTab("to");
      setView("year");
    } else {
      onChange({ ...value, to: newDate });
      onClose?.();
    }
  };

  const handlePresentToggle = () => {
    onChange({ ...value, to: isPresent ? null : "Present" });
    if (!isPresent) {
      onClose?.();
    }
  };

  const handleYearRangeNav = (direction: number) => {
    const step = 12;
    setYearRange((prev) => ({
      start: prev.start + direction * step,
      end: prev.end + direction * step,
    }));
  };

  const formatDate = (date: DateValue | "Present" | null): string => {
    if (!date) return "Select";
    if (date === "Present") return "Present";
    return `${months[date.month]} ${date.year}`;
  };

  const renderYearGrid = () => {
    const years: number[] = [];
    for (let y = yearRange.start; y <= yearRange.end; y++) {
      years.push(y);
    }

    return (
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => handleYearRangeNav(-1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {yearRange.start} - {yearRange.end}
          </span>
          <button
            onClick={() => handleYearRangeNav(1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearSelect(year)}
              className={cn(
                "px-2 py-1.5 text-sm rounded transition-colors",
                selectedYear === year
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthGrid = () => {
    return (
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setView("year")}
            className="p-1 rounded hover:bg-gray-100 flex items-center gap-1 text-sm text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{selectedYear}</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {months.map((month, index) => {
            const isSelected =
              currentValue &&
              currentValue !== "Present" &&
              typeof currentValue === "object" &&
              currentValue.month === index &&
              currentValue.year === selectedYear;

            return (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={cn(
                  "px-2 py-1.5 text-sm rounded transition-colors",
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                )}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white border border-gray-200 rounded-lg shadow-lg w-64",
        className
      )}
    >
      {/* Header with tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab("from");
            setView("year");
          }}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "from"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <span className="block text-xs text-gray-400">From</span>
          <span>{formatDate(value.from)}</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("to");
            setView("year");
          }}
          className={cn(
            "flex-1 px-3 py-2 text-sm font-medium transition-colors",
            activeTab === "to"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <span className="block text-xs text-gray-400">To</span>
          <span>{formatDate(value.to)}</span>
        </button>
        <button
          onClick={onClose}
          className="px-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Present toggle for "to" tab */}
      {activeTab === "to" && allowPresent && (
        <div className="px-3 py-2 border-b border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPresent}
              onChange={handlePresentToggle}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Currently working here
            </span>
          </label>
        </div>
      )}

      {/* Year/Month grid */}
      {!isPresent && (view === "year" ? renderYearGrid() : renderMonthGrid())}
    </div>
  );
};

export default MonthYearPicker;
