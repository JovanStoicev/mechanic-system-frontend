export type Role = "BOSS" | "MECHANIC" | "CUSTOMER";

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  token: string;
}
