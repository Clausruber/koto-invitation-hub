
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { generateResidentId } from '@/utils/generators';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'residentId'>) => Promise<boolean>;
  logout: () => void;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    whatsapp: '+1234567890',
    address: 'Calle Principal 123, Residencial Koto21',
    residentId: 'ABC12345'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // Mock authentication - in real app would validate against backend
        const user = mockUsers.find(u => u.email === email);
        if (user && password === '123456') {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      register: async (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          residentId: generateResidentId()
        };
        
        mockUsers.push(newUser);
        set({ user: newUser, isAuthenticated: true });
        return true;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'koto21-auth',
    }
  )
);
