export interface User {
    id: number;
    rut: string;
    name: string;
    last_name: string;
    role: Role;
    nick_name: string;
}

export interface Role {
    id: number;
    role_name: string;
}
