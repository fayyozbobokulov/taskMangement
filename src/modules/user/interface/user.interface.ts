export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  created_by: number | null;
  created_at?: Date;
  updated_at?: Date;
}
