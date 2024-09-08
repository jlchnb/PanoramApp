export interface UserLogin{
    username: string;
    password: string;
    role: 'admin' | 'user';
}