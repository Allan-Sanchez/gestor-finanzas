import { useState } from 'react';
import { DollarSign, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

const currencies = [
  { code: 'GTQ', name: 'Quetzal Guatemalteco', symbol: 'Q' },
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$' },
  { code: 'HNL', name: 'Lempira Hondureño', symbol: 'L' },
  { code: 'NIO', name: 'Córdoba Nicaragüense', symbol: 'C$' },
  { code: 'CRC', name: 'Colón Costarricense', symbol: '₡' },
  { code: 'PAB', name: 'Balboa Panameño', symbol: 'B/.' },
];

export default function CurrencySettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get current currency from user metadata
  const currentCurrency = user?.user_metadata?.currency || 'GTQ';
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Update auth.users metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          currency: selectedCurrency,
        }
      });

      if (authError) throw authError;

      // Update public.users table
      const { error: profileError } = await supabase
        .from('users')
        .update({ currency: selectedCurrency })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['user'] });

      setMessage({ type: 'success', text: 'Moneda actualizada exitosamente' });
    } catch (error: any) {
      console.error('Error updating currency:', error);
      setMessage({ type: 'error', text: error.message || 'Error al actualizar la moneda' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Moneda Preferida</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Currency Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selecciona tu moneda
          </label>
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} - {currency.name} ({currency.code})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Esta moneda se usará para mostrar todos los valores en la aplicación
          </p>
        </div>

        {/* Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-2">Vista previa</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-800">
              Símbolo: <span className="font-semibold">{selectedCurrencyData?.symbol}</span>
            </p>
            <p className="text-sm text-blue-800">
              Ejemplo: <span className="font-semibold">{selectedCurrencyData?.symbol}1,234.56</span>
            </p>
          </div>
        </div>

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
          disabled={isLoading || selectedCurrency === currentCurrency}
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
              {selectedCurrency === currentCurrency ? 'Sin Cambios' : 'Guardar Moneda'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
