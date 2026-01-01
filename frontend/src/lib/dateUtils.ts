export interface DateValue {
  month: number;
  year: number;
}

export const formatDate = (
  date: DateValue | string | null | undefined
): string => {
  if (!date) return "";
  if (date === "Present") return "Present";

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

  if (
    typeof date === "object" &&
    date.month !== undefined &&
    date.year !== undefined
  ) {
    return `${months[date.month]} ${date.year}`;
  }

  if (typeof date === "string") {
    if (months.some((m) => date.startsWith(m))) return date;
    const parts = date.split("/");
    if (parts.length === 2) {
      const monthNum = parseInt(parts[0], 10) - 1;
      if (monthNum >= 0 && monthNum < 12)
        return `${months[monthNum]} ${parts[1]}`;
    }
    return date;
  }

  return "";
};
