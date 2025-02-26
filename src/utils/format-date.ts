import moment from "moment";
import "moment/locale/vi";

// Set the locale to Vietnamese
moment.locale("vi");

export function formatDate(dateString: string, format?: string): string {
  return moment(dateString).format(format ?? "DD MMMM YYYY");
}
