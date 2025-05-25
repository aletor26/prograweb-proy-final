import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const DEFAULT_ADMIN = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@cheers.com',
  password: '123',
  role: 'admin' as const
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Cargar usuario actual si existe
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Asegurar que existe el admin por defecto
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify([DEFAULT_ADMIN]));
    } else {
      const users = JSON.parse(storedUsers);
      const adminExists = users.some((u: any) => u.email === DEFAULT_ADMIN.email);
      if (!adminExists) {
        users.push(DEFAULT_ADMIN);
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [DEFAULT_ADMIN];
    
    const foundUser = users.find((u: any) => 
      u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Credenciales inválidas');
    }

    // Asegurarse de que el usuario tenga un rol válido
    if (!foundUser.role) {
      foundUser.role = 'customer';
    }

    const userToSave = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role as 'customer' | 'admin'
    };

    setUser(userToSave);
    localStorage.setItem('currentUser', JSON.stringify(userToSave));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export default AuthContext;