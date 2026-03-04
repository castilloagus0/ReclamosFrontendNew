export interface Usuario {
    _id: string;
    email: string;
    fullName: string;
    roles: string[];
    createdAt: Date;
}