export type User = {
  id: string;
  userName: string;
  phone: string;
  email: string;
  location: string;
  role: "client" | "provider";
  status: "active" | "inactive";
  image: string;
  rtn?: string;
  otherInformation?: string;

  createdAt?: Date;
  updatedAt?: Date;
};
export type Library = {
  id: string;
  slug: string;
  title: string;
  author: string;
  email: string;
  icon: string;
  desc: string;
};
