import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

type AuthView = 'login' | 'register' | 'forgot-password';

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Gestor de Finanzas</h1>
          </div>

          {/* Forms */}
          {currentView === 'login' && (
            <LoginForm
              onSwitchToRegister={() => setCurrentView('register')}
              onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
            />
          )}

          {currentView === 'register' && (
            <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPasswordForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>
    </div>
  );
}
