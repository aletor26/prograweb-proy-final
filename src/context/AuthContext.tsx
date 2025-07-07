import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as loginService } from '../services/clienteservicios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  activo: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restaurar sesión desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Función de login conectada al backend
  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password); // llama al backend
      const foundUser = data.usuario;

      if (foundUser.activo === false) {
        throw new Error('La cuenta está desactivada. Contacta al administrador.');
      }

      const userToSave: User = {
        id: foundUser.id.toString(),
        name: foundUser.nombre + ' ' + foundUser.apellido,
        email: foundUser.correo,
        role: foundUser.rol || 'customer', // por si no viene definido
        activo: foundUser.activo ?? true,
      };

      setUser(userToSave);
      localStorage.setItem('currentUser', JSON.stringify(userToSave));
    } catch (err) {
      throw new Error('Credenciales inválidas');
    }
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
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export default AuthContext;
