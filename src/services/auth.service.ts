import { LoginCredentials, User } from '../types';

// Mock user data
const mockUsers: User[] = [
  { id: 1, username: 'admin', password: 'admin123' }
];

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  addUser: async (newUser: Omit<User, 'id'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const id = mockUsers.length + 1;
    const user = { ...newUser, id };
    mockUsers.push(user);
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.map(({ password, ...user }) => user);
  }
}; 