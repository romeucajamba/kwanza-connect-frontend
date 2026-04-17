import { api } from '@lib/axios';
import { API_ROUTES } from '@constants';
import type { ExchangeRate, ApiResponse, DashboardStats } from '@types';

const FALLBACK_CURRENCIES = [
  { id: "64c58acf-82bb-54dd-94aa-3bf86ee1c270", code: "AOA", name: "Kwanza", symbol: "Kz", flag_emoji: "🇦🇴" },
  { id: "dac75bd9-1dc3-57ba-92f3-5772d815fbfb", code: "USD", name: "Dólar Americano", symbol: "$", flag_emoji: "🇺🇸" },
  { id: "0892b9d7-445f-5f30-ac46-129c435a6313", code: "EUR", name: "Euro", symbol: "€", flag_emoji: "🇪🇺" },
  { id: "986de2ee-438d-5e13-b0ae-878a1709e7c3", code: "BRL", name: "Real", symbol: "R$", flag_emoji: "🇧🇷" },
  { id: "6a94a686-9139-5c18-84e5-677c7b062026", code: "GBP", name: "Libra Esterlina", symbol: "£", flag_emoji: "🇬🇧" },
  { id: "7d61f8e1-413d-5014-8bc5-e910520a0ff6", code: "ZAR", name: "Rand", symbol: "R", flag_emoji: "🇿🇦" },
  { id: "e5ab4e4c-d554-5408-8198-e22d6ed8b48c", code: "MZN", name: "Metical", symbol: "MT", flag_emoji: "🇲🇿" },
  { id: "bb7f4bf3-1d2e-5e94-832a-4fa7ddc9b8d8", code: "AED", name: "Dirham", symbol: "د.إ", flag_emoji: "🇦🇪" }
];

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v2';

// Mapeamento auxiliar para nomes em português e bandeiras
const CURRENCY_METADATA: Record<string, { name: string, flag: string, symbol: string }> = {
  "AOA": { name: "Kwanza", flag: "🇦🇴", symbol: "Kz" },
  "USD": { name: "Dólar Americano", flag: "🇺🇸", symbol: "$" },
  "EUR": { name: "Euro", flag: "🇪🇺", symbol: "€" },
  "BRL": { name: "Real", flag: "🇧🇷", symbol: "R$" },
  "GBP": { name: "Libra Esterlina", flag: "🇬🇧", symbol: "£" },
  "ZAR": { name: "Rand", flag: "🇿🇦", symbol: "R" },
  "MZN": { name: "Metical", flag: "🇲🇿", symbol: "MT" },
  "AED": { name: "Dirham", flag: "🇦🇪", symbol: "د.إ" },
};

const getCurrencyMeta = (code: string) => CURRENCY_METADATA[code] || { name: code, flag: "🌐", symbol: "" };

export const ratesService = {
  getExchangeRates: async (base = 'USD'): Promise<ExchangeRate[]> => {
    try {
      const response = await fetch(`${FRANKFURTER_BASE_URL}/rates?base=${base}`);
      if (!response.ok) throw new Error('API Response not OK');
      const data = await response.json();
      
      // Frankfurter v2 /rates retorna um array de objetos [{date, base, quote, rate}, ...]
      return data.map((item: any) => {
        const fromMeta = getCurrencyMeta(item.base);
        const toMeta = getCurrencyMeta(item.quote);
        
        return {
          from_currency: { 
            code: item.base, 
            name: fromMeta.name, 
            symbol: fromMeta.symbol, 
            flag_emoji: fromMeta.flag, 
            id: item.base, 
            is_active: true 
          },
          to_currency: { 
            code: item.quote, 
            name: toMeta.name, 
            symbol: toMeta.symbol, 
            flag_emoji: toMeta.flag, 
            id: item.quote, 
            is_active: true 
          },
          rate: item.rate,
          fetched_at: item.date
        };
      });
    } catch (error) {
      console.error('Frankfurter API Error:', error);
      return [];
    }
  },

  getCurrencies: async (): Promise<any[]> => {
    try {
      const response = await fetch(`${FRANKFURTER_BASE_URL}/currencies`);
      if (!response.ok) throw new Error('API Response not OK');
      const data = await response.json();
      
      // Frankfurter v2 /currencies retorna um array de objetos
      return data.map((c: any) => {
        const meta = getCurrencyMeta(c.iso_code);
        return {
          id: c.iso_code,
          code: c.iso_code,
          name: meta.name || c.name,
          symbol: meta.symbol || c.symbol,
          flag_emoji: meta.flag,
          is_active: true
        };
      });
    } catch {
      return FALLBACK_CURRENCIES;
    }
  },

  convert: async (params: { from: string; to: string; amount: number }): Promise<any> => {
    try {
      const response = await fetch(`${FRANKFURTER_BASE_URL}/rate/${params.from}/${params.to}`);
      if (!response.ok) throw new Error('API Response not OK');
      const d = await response.json();
      const result = (params.amount * d.rate);
      return {
        rate: d.rate,
        converted_amount: result,
        date: d.date
      };
    } catch (error) {
      console.error('Conversion Error:', error);
      throw error;
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(API_ROUTES.RATES.DASHBOARD);
    return response.data.data;
  },
};
