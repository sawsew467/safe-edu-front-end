import { Row } from "@tanstack/react-table";

export function filterDateRange<TData>(
  row: Row<TData>,
  id: string,
  [from, to]: [Date, Date],
) {
  if (!from || !to) return true;

  const value = new Date(row.getValue(id));

  return value >= new Date(from) && value <= new Date(to);
}
