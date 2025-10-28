import { ReportFormSchema } from "./report.schema";

export interface School {
  id: string;
  name: string;
  contact_email: string;
  contact_phone: string;
}

export interface ReportFormData {
  victim_name?: string;
  class_grade: string;
  gender: string;
  relationship_to_victim: string;
  relationship_other?: string;
  violence_types: string[];
  violence_other?: string;
  location: string;
  location_other?: string;
  time_of_incident: string;
  impact_level: string;
  current_situation: string;
  information_sources: string[];
  information_reliability: string;
  contact_option: boolean;
  contact_info?: string;
  school_id: string;
}

export interface EvidenceFile {
  id: string;
  file: File;
  preview: string;
}

export interface CreateReportPayload
  extends Omit<ReportFormSchema, "organizationId"> {
  organizationId: string;
  alert_level?: number;
  has_evidence?: boolean;
  evidence?: string[];
}

export interface StatusTimelineItem {
  oldStatus?: string | null;
  newStatus: string;
  changedBy?: string;
  note?: string;
  changedAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  province_id?: string;
  manager_id?: string[];
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  _id: string;
  victimName?: string;
  classGrade: string;
  gender?: string;
  relationshipToVictim?: string;
  relationshipOther?: string;
  violenceTypes: string[];
  violenceOther?: string;
  location?: string;
  locationOther?: string;
  timeOfIncident?: string;
  impactLevel?: string;
  currentSituation?: string;
  informationSources: string[];
  informationReliability?: string;
  contactOption: boolean;
  contactInfo?: string;
  externalContactInfo?: string;
  organizationId: string | Organization;
  alertLevel: number;
  hasEvidence: boolean;
  evidenceUrl?: string | string[];
  status: string;
  statusTimeline?: StatusTimelineItem[];
  created_by?: string;
  update_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportListResponse {
  data: Report[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateReportStatusPayload {
  status: string;
}
