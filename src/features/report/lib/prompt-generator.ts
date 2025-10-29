import {
  translateViolenceType,
  translateLocation,
  translateImpactLevel,
  translateCurrentSituation,
} from "./translation-utils";

export interface ReportData {
  victimName?: string;
  classGrade?: string;
  gender?: string;
  relationshipToVictim?: string;
  violenceTypes?: string[];
  violenceOther?: string;
  location?: string;
  locationOther?: string;
  timeOfIncident?: string;
  impactLevel?: string;
  currentSituation?: string;
  informationSources?: string[];
  informationReliability?: string;
  additionalDetails?: string;
  alertLevel?: number;
}

export function generateEmergencyPrompt(reportData: ReportData): string {
  const violenceTypesText = reportData.violenceTypes
    ?.map((type) => translateViolenceType(type))
    .join(", ");

  const locationText = reportData.location
    ? translateLocation(reportData.location)
    : "";

  const impactText = reportData.impactLevel
    ? translateImpactLevel(reportData.impactLevel)
    : "";

  const situationText = reportData.currentSituation
    ? translateCurrentSituation(reportData.currentSituation)
    : "";

  let prompt = `🚨 KHẨN CẤP - Tôi vừa báo cáo một vụ bạo lực học đường mức độ NGHIÊM TRỌNG:

📍 **Thông tin vụ việc:**
- Hình thức bạo lực: ${violenceTypesText || "Không rõ"}
- Địa điểm: ${locationText || "Không rõ"}${
    reportData.locationOther ? ` (${reportData.locationOther})` : ""
  }
- Mức độ ảnh hưởng: ${impactText || "Không rõ"}
- Tình trạng hiện tại: ${situationText || "Không rõ"}`;

  if (reportData.classGrade) {
    prompt += `\n- Lớp/Khối: ${reportData.classGrade}`;
  }

  if (reportData.additionalDetails) {
    prompt += `\n- Chi tiết: ${reportData.additionalDetails}`;
  }

  prompt += `\n\n💡 **Tôi cần hỗ trợ ngay:**
- Hướng dẫn các bước xử lý khẩn cấp
- Cách bảo vệ an toàn cho nạn nhân
- Danh sách đường dây nóng liên hệ
- Lời khuyên về cách tiếp cận và can thiệp

Xin hãy ưu tiên tư vấn khẩn cấp cho tình huống này! 🆘`;

  return prompt;
}

export function generateReportPrompt(reportData: ReportData): string {
  const violenceTypesText = reportData.violenceTypes
    ?.map((type) => translateViolenceType(type))
    .join(", ");

  const impactText = reportData.impactLevel
    ? translateImpactLevel(reportData.impactLevel)
    : "";

  const situationText = reportData.currentSituation
    ? translateCurrentSituation(reportData.currentSituation)
    : "";

  let prompt = `📋 Tôi vừa hoàn thành một báo cáo bạo lực học đường với thông tin sau:

🔍 **Thông tin cơ bản:**
- Hình thức bạo lực: ${violenceTypesText || "Không rõ"}
- Mức độ ảnh hưởng: ${impactText || "Không rõ"}
- Tình trạng: ${situationText || "Không rõ"}`;

  if (reportData.classGrade) {
    prompt += `\n- Lớp/Khối: ${reportData.classGrade}`;
  }

  prompt += `\n\n💭 **Tôi muốn trao đổi về:**
- Đánh giá tình huống và mức độ nghiêm trọng
- Các bước tiếp theo cần thực hiện
- Cách hỗ trợ nạn nhân hiệu quả
- Biện pháp ngăn chặn tái diễn

Bạn có thể tư vấn thêm cho tôi không?`;

  return prompt;
}
