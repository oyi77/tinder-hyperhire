export interface Profile {
  id: number;
  name: string;
  age: number;
  pictures: string[];
  location: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  email: string;
  profile?: Profile;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LikeResponse {
  message: string;
  match: boolean;
}

