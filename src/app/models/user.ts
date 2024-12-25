export interface User {
  id: number;
  rut: string;
  name: string;
  last_name: string;
  is_active: boolean;
  nick_name: string;
  role: Role;
}

export interface Role {
  id: number;
  role_name: string;
}
