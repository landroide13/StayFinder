export type UserRole = 'host' | 'client';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at?: string;
}




