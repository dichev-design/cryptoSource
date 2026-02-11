export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  register: (username: string, email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}
