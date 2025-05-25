import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

interface ValidationErrors {
  email?: string;
  code?: string;
  password?: string;
  confirmPassword?: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    } else {
      // Validar que el email exista en localStorage
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userExists = users.some((u: any) => u.email === email);
      if (!userExists) {
        newErrors.email = 'No existe una cuenta registrada con ese correo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswords = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateRecoveryCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      // Generar código de 6 dígitos
      const newCode = generateRecoveryCode();
      setRecoveryCode(newCode);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar código en la consola
      console.log('Código de recuperación:', newCode);
      
      setIsCodeSent(true);
    } catch (error) {
      setErrors({
        email: 'No se pudo enviar el código de recuperación'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      setErrors({ code: 'Ingresa el código de recuperación' });
      return;
    }

    if (code === recoveryCode) {
      setIsVerified(true);
    } else {
      setErrors({ code: 'Código incorrecto' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    try {
      // Obtener usuarios del localStorage
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Actualizar la contraseña del usuario
      const updatedUsers = users.map((user: any) => {
        if (user.email === email) {
          return { ...user, password };
        }
        return user;
      });

      // Guardar usuarios actualizados
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir al login
      navigate('/login');
    } catch (error) {
      setErrors({
        password: 'Error al actualizar la contraseña'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Cambiar Contraseña</h1>
          <p className="auth-description">
            Ingresa tu nueva contraseña
          </p>
          
          <form onSubmit={handleChangePassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Nueva contraseña</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({});
                    }
                  }}
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
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({});
                    }
                  }}
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
              {isLoading ? 'Actualizando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (isCodeSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Verifica tu código</h1>
          <p className="auth-message">
            Hemos enviado un código de recuperación a <strong>{email}</strong>
          </p>
          <p className="auth-message">
            (El código se muestra en la consola del navegador)
          </p>
          
          <form onSubmit={handleVerifyCode} className="auth-form">
            <div className="form-group">
              <label htmlFor="code">Código de recuperación</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (errors.code) {
                    setErrors({});
                  }
                }}
                className={errors.code ? 'error' : ''}
                maxLength={6}
                placeholder="123456"
              />
              {errors.code && <span className="error-message">{errors.code}</span>}
            </div>

            <button type="submit" className="auth-button">
              Verificar código
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Recuperar Contraseña</h1>
        <p className="auth-description">
          Ingresa tu email y te enviaremos un código de recuperación.
        </p>
        
        <form onSubmit={handleSendCode} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({});
                }
              }}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              placeholder="usuario@gmail.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar código'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;