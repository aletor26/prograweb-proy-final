import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

interface RegisterForm {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  nombre?: string;
  apellido?: string;
  email?: string;
  dni?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterForm>({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }

    if (!formData.dni) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'DNI inválido (8 dígitos)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Verificar si el usuario ya existe
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userExists = users.some((u: any) => u.email === formData.email);
      
      if (userExists) {
        setErrors({
          email: 'Este correo ya está registrado'
        });
        setIsLoading(false);
        return;
      }

      // Guardar nuevo usuario con id y role
      const newUser = {
        id: crypto.randomUUID(),
        name: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        dni: formData.dni,
        password: formData.password,
        role: 'customer'
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Iniciar sesión automáticamente con id y role
      login({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      });
      navigate('/');
    } catch (error) {
      setErrors({
        general: 'Error al crear la cuenta'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Registro</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={errors.nombre ? 'error' : ''}
                placeholder="Nombre del usuario"
                disabled={isLoading}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={errors.apellido ? 'error' : ''}
                placeholder="Apellido del usuario"
                disabled={isLoading}
              />
              {errors.apellido && <span className="error-message">{errors.apellido}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="usuario@gmail.com"
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              className={errors.dni ? 'error' : ''}
              placeholder="DNI"
              maxLength={8}
              disabled={isLoading}
            />
            {errors.dni && <span className="error-message">{errors.dni}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirme contraseña</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={isLoading}
              />
              <button 
                type="button" 
                className="show-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Ya tengo una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;