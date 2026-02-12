export interface OrganizationInfo {
  _id: string;
  isActive: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  update_by: string | null;
  name: string;
  province_id: string;
  manager_id: string[];
  slug: string;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

export interface SignupLink {
  _id: string;
  isActive: boolean;
  deleted_at: string | null;
  deleted_by: string | null;
  created_by: string | null;
  update_by: string | null;
  organization_id: string | OrganizationInfo;
  token: string;
  start_date: string;
  expiration_date: string;
  is_revoked: boolean;
  revoked_at: string | null;
  revoked_by: string | null;
  created_at: string;
  updated_at: string;
  __v: number;
  id: string;
}

export interface GenerateSignupLinkRequest {
  startDate: string;
  expirationDate: string;
}

export interface GenerateSignupLinkResponse {
  code: number;
  message: string;
  data: SignupLink;
}

export interface GetActiveSignupLinksResponse {
  code: number;
  message: string;
  data: SignupLink[];
}

export interface RevokeSignupLinkResponse {
  code: number;
  message: string;
  data: SignupLink;
}

export interface ValidateSignupLinkResponse {
  code: number;
  message: string;
  data: {
    isValid: boolean;
    organizationId: string;
    message: string;
  };
}
