export interface User {
  id: number;
  username: string;
  password?: string;
}

export interface Document {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
} 