// Status mapping from English to Vietnamese
export const STATUS_MAPPING: Record<string, string> = {
  Pending: "Đang chờ xử lý",
  "In Progress": "Đang xử lý",
  Resolved: "Đã giải quyết",
  Rejected: "Đã từ chối",
  "Evidence Added": "Đã thêm bằng chứng",
  Unresolved: "Chưa giải quyết",
  "Under Review": "Đang xem xét",
  Closed: "Đã đóng",
  "Need More Info": "Cần thêm thông tin",
  Escalated: "Đã chuyển cấp cao",
};

// Badge variant mapping for status
export const STATUS_BADGE_VARIANTS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  Pending: { label: "Đang chờ xử lý", variant: "secondary" },
  "In Progress": { label: "Đang xử lý", variant: "default" },
  Resolved: { label: "Đã giải quyết", variant: "outline" },
  Rejected: { label: "Đã từ chối", variant: "destructive" },
  "Evidence Added": { label: "Đã thêm bằng chứng", variant: "outline" },
  Unresolved: { label: "Chưa giải quyết", variant: "destructive" },
  "Under Review": { label: "Đang xem xét", variant: "secondary" },
  Closed: { label: "Đã đóng", variant: "outline" },
  "Need More Info": { label: "Cần thêm thông tin", variant: "secondary" },
  Escalated: { label: "Đã chuyển cấp cao", variant: "default" },
};

// Helper function to get Vietnamese status name
export const getVietnameseStatus = (status: string): string => {
  return STATUS_MAPPING[status] || status;
};

// Helper function to get status badge config
export const getStatusConfig = (status: string) => {
  return (
    STATUS_BADGE_VARIANTS[status] || {
      label: status,
      variant: "outline" as const,
    }
  );
};
