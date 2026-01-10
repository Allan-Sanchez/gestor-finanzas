import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input } from '../ui';

interface ForgotPasswordFormProps {
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-blue-600 text-5xl mb-4">📧</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revisa tu correo</h2>
        <p className="text-gray-600">
          Te hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>
        </p>
        <Button onClick={onSwitchToLogin} className="w-full">
          Volver al Inicio de Sesión
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recuperar Contraseña</h2>
        <p className="text-gray-600 mt-2">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="tu@email.com"
        autoComplete="email"
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Enviar Enlace de Recuperación
      </Button>

      <p className="text-center text-sm text-gray-600">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Volver al inicio de sesión
        </button>
      </p>
    </form>
  );
}
