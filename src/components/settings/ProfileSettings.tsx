import { useState } from 'react';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    avatar_url: user?.user_metadata?.avatar_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
        }
      });

      if (authError) throw authError;

      // Update public.users table
      const { error: profileError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user'] });

      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message || 'Error al actualizar el perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Perfil de Usuario</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo
          </label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tu nombre completo"
          />
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de Avatar
          </label>
          <input
            type="url"
            value={formData.avatar_url}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://ejemplo.com/avatar.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">URL de tu imagen de perfil</p>
        </div>

        {/* Avatar Preview */}
        {formData.avatar_url && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista previa
            </label>
            <div className="flex items-center gap-3">
              <img
                src={formData.avatar_url}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64';
                }}
              />
              <span className="text-sm text-gray-600">{formData.full_name || 'Sin nombre'}</span>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar Cambios
            </>
          )}
        </button>
      </form>
    </div>
  );
}
