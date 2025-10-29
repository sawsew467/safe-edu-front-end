export type AlertLevel = 1 | 2 | 3 | 4;

export interface AlertInfo {
  level: AlertLevel;
  name: string;
  color: string;
  icon: string; // Lucide icon name
  description: string;
}

export function calculateAlertLevel(
  impactLevel: string,
  currentSituation: string,
  hasEvidence: boolean,
): AlertLevel {
  // 🟢 Level 1 – Nhẹ
  // Ảnh hưởng nhẹ, vụ việc đã chấm dứt
  // (C8 = Nhẹ) và (C9 = Đã chấm dứt)
  if (impactLevel === "Mild" && currentSituation === "Ended") {
    return 1;
  }

  // 🟠 Level 2 – Trung bình
  // Có tổn thương tinh thần / xô xát, vụ việc có thể còn tồn tại
  // (C8 = Trung bình) và (C9 = Vẫn đang diễn ra hoặc C9 = Có dấu hiệu leo thang)
  if (
    impactLevel === "Moderate" &&
    (currentSituation === "Still happening" ||
      currentSituation === "Escalating")
  ) {
    return 2;
  }

  // ⚠️ Level 4 – Khẩn cấp
  // Có thương tích nặng, đe dọa tính mạng, hoặc thông tin xác định vụ việc đang diễn ra, lan truyền nhanh
  // (C8 = Nghiêm trọng) và (C9 = Có dấu hiệu leo thang) hoặc người phản ánh có minh chứng tải lên (C12 = Có)
  if (
    (impactLevel === "Severe" && currentSituation === "Escalating") ||
    hasEvidence
  ) {
    return 4;
  }

  // 🔴 Level 3 – Nghiêm trọng
  // Có thương tích, tổn thương kéo dài, lan truyền mạng, chưa được xử lý
  // (C8 = Nghiêm trọng) và (C9 ≠ Đã chấm dứt)
  if (impactLevel === "Severe" && currentSituation !== "Ended") {
    return 3;
  }

  // Default: Nếu không thỏa các điều kiện trên, trả về Level 1
  return 1;
}

export function getAlertInfo(level: AlertLevel): AlertInfo {
  const alertMap: Record<AlertLevel, AlertInfo> = {
    1: {
      level: 1,
      name: "Nhẹ",
      color: "bg-green-500",
      icon: "CheckCircle",
      description:
        "Hệ thống ghi nhận phản ánh ở mức 'theo dõi'. Dữ liệu lưu trong thống kê ẩn danh để phân tích xu hướng.",
    },
    2: {
      level: 2,
      name: "Trung bình",
      color: "bg-orange-500",
      icon: "AlertCircle",
      description:
        "Tự động gửi cảnh báo đến Cán bộ công tác học sinh – sinh viên. Đề xuất can thiệp mềm (trao đổi, tư vấn, kết nối tâm lý viên).",
    },
    3: {
      level: 3,
      name: "Nghiêm trọng",
      color: "bg-red-500",
      icon: "AlertTriangle",
      description:
        "Gửi cảnh báo ưu tiên cao đến Hiệu trưởng và Phó Hiệu trưởng phụ trách HS-SV. Đồng thời kích hoạt quy trình xác minh và hỗ trợ tâm lý khẩn.",
    },
    4: {
      level: 4,
      name: "Khẩn cấp",
      color: "bg-amber-500",
      icon: "AlertOctagon",
      description:
        "Tự động kích hoạt chế độ báo động học đường: Gửi thông báo ngay lập tức (qua email và SMS nội bộ) đến lãnh đạo trường.",
    },
  };

  return alertMap[level];
}
