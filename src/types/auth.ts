export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export const SUPER_ADMIN_EMAIL = 'bqutrhieu1602@gmail.com';
