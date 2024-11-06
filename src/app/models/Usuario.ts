export interface Usuario {
  id?: string;
  username?: string;
  password?: string;
  role: 'admin' | 'user' | 'anonymous';
  isVerified?: boolean;
  email?: string;
  fullName?: string;
  birthDate?: Date | null;
}