export type User = {
  id: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  location: string;
  organizationId: string;
  gender: "male" | "female";
  role: "admin" | "moderator" | "resident" | "student";
  status: "active" | "inactive";

  createdAt?: Date;
  updatedAt?: Date;
};
export type Admin = {
  first_name: string;
  last_name: string;
  phone_number: string;
  avatar_url: string;
  isActive: true;
  deleted_at: null;
  deleted_by: null;
  created_by: null;
  update_by: null;
  is_registered_with_google: false;
  avatar: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  id: string;
  phone: string;
  email: string;
};
export type TypeAddNewAdmin = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
};