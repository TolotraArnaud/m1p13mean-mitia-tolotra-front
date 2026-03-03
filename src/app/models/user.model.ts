// models/user.model.ts
export interface User {
  id?: string;
  _id?: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'boutique' | 'client';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
