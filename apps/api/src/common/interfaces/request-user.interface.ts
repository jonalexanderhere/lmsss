import type { AppRole } from "../types/app-role.type";

export interface RequestUser {
  sub: string;
  email?: string;
  role: AppRole;
  name?: string;
}
