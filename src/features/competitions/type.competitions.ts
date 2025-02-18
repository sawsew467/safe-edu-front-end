import { Organization } from "../organizations/types";

export interface Competitions {
  _id: string;
  title: string;
  organizations: Organization;
  image: string;
  number_join: number;
  isActive: boolean;
  create_at: string;
  update_at: string;
  create_by: string;
}
