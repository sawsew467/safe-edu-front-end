import {
  VIOLENCE_TYPES,
  INFORMATION_SOURCES,
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  LOCATION_OPTIONS,
  TIME_OPTIONS,
  IMPACT_LEVEL_OPTIONS,
  CURRENT_SITUATION_OPTIONS,
  RELIABILITY_OPTIONS,
} from "../report.data";

/**
 * Tạo map từ value (tiếng Anh) sang label (tiếng Việt)
 */
const createTranslationMap = (
  options: Array<{ value: string; label: string }>,
) => {
  const map = new Map<string, string>();

  options.forEach((option) => {
    map.set(option.value, option.label);
  });

  return map;
};

// Tạo các maps
const violenceTypesMap = createTranslationMap(VIOLENCE_TYPES);
const informationSourcesMap = createTranslationMap(INFORMATION_SOURCES);
const genderMap = createTranslationMap(GENDER_OPTIONS);
const relationshipMap = createTranslationMap(RELATIONSHIP_OPTIONS);
const locationMap = createTranslationMap(LOCATION_OPTIONS);
const timeMap = createTranslationMap(TIME_OPTIONS);
const impactLevelMap = createTranslationMap(IMPACT_LEVEL_OPTIONS);
const currentSituationMap = createTranslationMap(CURRENT_SITUATION_OPTIONS);
const reliabilityMap = createTranslationMap(RELIABILITY_OPTIONS);

/**
 * Map hình thức bạo lực từ tiếng Anh sang tiếng Việt
 */
export const translateViolenceType = (value: string): string => {
  return violenceTypesMap.get(value) || value;
};

/**
 * Map nguồn thông tin từ tiếng Anh sang tiếng Việt
 */
export const translateInformationSource = (value: string): string => {
  return informationSourcesMap.get(value) || value;
};

/**
 * Map giới tính từ tiếng Anh sang tiếng Việt
 */
export const translateGender = (value: string): string => {
  return genderMap.get(value) || value;
};

/**
 * Map mối quan hệ từ tiếng Anh sang tiếng Việt
 */
export const translateRelationship = (value: string): string => {
  return relationshipMap.get(value) || value;
};

/**
 * Map địa điểm từ tiếng Anh sang tiếng Việt
 */
export const translateLocation = (value: string): string => {
  return locationMap.get(value) || value;
};

/**
 * Map thời gian từ tiếng Anh sang tiếng Việt
 */
export const translateTime = (value: string): string => {
  return timeMap.get(value) || value;
};

/**
 * Map mức độ ảnh hưởng từ tiếng Anh sang tiếng Việt
 */
export const translateImpactLevel = (value: string): string => {
  return impactLevelMap.get(value) || value;
};

/**
 * Map tình trạng hiện tại từ tiếng Anh sang tiếng Việt
 */
export const translateCurrentSituation = (value: string): string => {
  return currentSituationMap.get(value) || value;
};

/**
 * Map độ tin cậy từ tiếng Anh sang tiếng Việt
 */
export const translateReliability = (value: string): string => {
  return reliabilityMap.get(value) || value;
};

/**
 * Map trạng thái báo cáo từ tiếng Anh sang tiếng Việt
 */
export const translateStatus = (value: string): string => {
  const statusMap: Record<string, string> = {
    Create: "Đã Tạo",
    Pending: "Đang chờ xử lý",
    "In Progress": "Đang xử lý",
    Resolved: "Đã giải quyết",
    Rejected: "Đã từ chối",
    "Evidence Added": "Đã thêm bằng chứng",
  };

  return statusMap[value] || value;
};
