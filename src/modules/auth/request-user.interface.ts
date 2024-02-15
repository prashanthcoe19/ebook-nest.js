export interface RequestUser {
    id: number;
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    isVerified: boolean;
    token: string;
    token_expires: Date;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
}