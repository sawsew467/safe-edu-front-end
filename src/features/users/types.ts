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
export type Library = {
  id: string;
  slug: string;
  title: string;
  icon: any;
  subtitle: Array<{
    id: string;
    title: string;
    content: Array<string>;
    image: Array<any>;
    imageDescription: Array<string>;
  }>;
};
