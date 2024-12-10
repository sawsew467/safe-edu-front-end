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
