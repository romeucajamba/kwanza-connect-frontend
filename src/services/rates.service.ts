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
  { id: "bb7f4bf3-1d2e-5e94-832a-4fa7ddc9b8d8", code: "AED", name: "Dirham", symbol: "د.إ", flag_emoji: "🇦🇪" },
  { id: "18e1bc63-2662-5d0a-9195-1ad6b1d39e16", code: "AFN", name: "Afegane", symbol: "؋", flag_emoji: "🇦🇫" },
  { id: "7463cbb6-07cf-5887-9ff2-7dc6b983bd39", code: "ALL", name: "Lek", symbol: "L", flag_emoji: "🇦🇱" },
  { id: "2f980ca8-057c-5f4a-8d0f-6c9da51f98a7", code: "ARS", name: "Peso Argentino", symbol: "$", flag_emoji: "🇦🇷" },
  { id: "1ecca298-de79-5e80-a88a-8686569a2c8a", code: "AUD", name: "Dólar Australiano", symbol: "$", flag_emoji: "🇦🇺" },
  { id: "4eb6cdd4-2d50-5a85-a599-80ad462c221d", code: "CAD", name: "Dólar Canadense", symbol: "$", flag_emoji: "🇨🇦" },
  { id: "a674708e-9f3f-5ba1-b397-37d77fb3adba", code: "CHF", name: "Franco Suíço", symbol: "Fr.", flag_emoji: "🇨🇭" },
  { id: "da2b5885-f5d9-5237-9b35-e869bdaeae09", code: "CLP", name: "Peso Chileno", symbol: "$", flag_emoji: "🇨🇱" },
  { id: "5019e208-29a7-504e-8469-5f75d3fcdf9d", code: "CNY", name: "Yuan Renminbi", symbol: "¥", flag_emoji: "🇨🇳" },
  { id: "e52d10f7-c57d-5d0b-99c0-643c76952d61", code: "COP", name: "Peso Colombiano", symbol: "$", flag_emoji: "🇨🇴" },
  { id: "7da78b17-efa8-5869-9726-f6dcf76729df", code: "DKK", name: "Coroa Dinamarquesa", symbol: "kr", flag_emoji: "🇩🇰" },
  { id: "4e800971-e7fc-558e-9ede-bccf1928b5da", code: "EGP", name: "Libra Egípcia", symbol: "£", flag_emoji: "🇪🇬" },
  { id: "78cf6cb4-bbde-5d7a-9799-80d475d65de3", code: "HKD", name: "Dólar de Hong Kong", symbol: "$", flag_emoji: "🇭🇰" },
  { id: "dd2bbe1e-3a84-560b-bbcf-420023b42f8e", code: "IDR", name: "Rupiah", symbol: "Rp", flag_emoji: "🇮🇩" },
  { id: "db97d26a-1917-56e1-be51-41f6e9e8104d", code: "ILS", name: "Novo Shekel", symbol: "₪", flag_emoji: "🇮🇱" },
  { id: "080420ca-f7b9-5e3b-8786-4e1aba174fc0", code: "INR", name: "Rupia Indiana", symbol: "₹", flag_emoji: "🇮🇳" },
  { id: "5738ae77-1e38-5ceb-9657-c6c5b3c412f2", code: "JPY", name: "Iene", symbol: "¥", flag_emoji: "🇯🇵" },
  { id: "e04c06bf-23ab-57e9-bafc-ca47c83eab28", code: "KRW", name: "Won", symbol: "₩", flag_emoji: "🇰🇷" },
  { id: "324cdbc7-e133-5d3c-b0ea-1538f52d3404", code: "MXN", name: "Peso Mexicano", symbol: "$", flag_emoji: "🇲🇽" },
  { id: "18388f9b-6b6e-5e5e-b15b-e199614aebb3", code: "NGN", name: "Naira", symbol: "₦", flag_emoji: "🇳🇬" },
  { id: "fe6b8dfe-3aea-5fae-8e01-e14cae398219", code: "NOK", name: "Coroa Norueguesa", symbol: "kr", flag_emoji: "🇳🇴" },
  { id: "5ddd887c-35d9-56a7-986f-264bed952d85", code: "NZD", name: "Dólar Neozelandês", symbol: "$", flag_emoji: "🇳🇿" },
  { id: "27a9fec8-d1fd-5b46-b55d-a853e70ffa2f", code: "PEN", name: "Sol", symbol: "S/", flag_emoji: "🇵🇪" },
  { id: "a92471f5-11f2-50ca-ab94-61cc67d9e00d", code: "PHP", name: "Peso Filipino", symbol: "₱", flag_emoji: "🇵🇭" },
  { id: "304193e5-429b-5291-8f37-43eaded0db36", code: "PLN", name: "Zloty", symbol: "zł", flag_emoji: "🇵🇱" },
  { id: "b5702257-caf2-5321-893e-6c80bf1e5506", code: "PYG", name: "Guarani", symbol: "₲", flag_emoji: "🇵🇾" },
  { id: "643d8262-ecc3-5545-941b-f26e57d2ba00", code: "RUB", name: "Rublo", symbol: "₽", flag_emoji: "🇷🇺" },
  { id: "dc557311-033f-5d1f-8c89-cc838fdd8d23", code: "SAR", name: "Riyal Saudita", symbol: "ر.س", flag_emoji: "🇸🇦" },
  { id: "f10017ac-7318-59ff-8b25-bfcd6a0c5eb5", code: "THB", name: "Baht", symbol: "฿", flag_emoji: "🇹🇭" },
  { id: "35015aa7-52d3-5db2-b55d-bd76dbc94507", code: "TRY", name: "Lira Turca", symbol: "₺", flag_emoji: "🇹🇷" },
  { id: "27510350-b463-51d8-bad0-92af70c56b2c", code: "UYU", name: "Peso Uruguaio", symbol: "", flag_emoji: "🇺🇾" },
  { id: "2725163d-b063-5de5-ad95-a4e8c723064d", code: "VND", name: "Dong", symbol: "₫", flag_emoji: "🇻🇳" }
];

export const ratesService = {
  getExchangeRates: async (): Promise<ExchangeRate[]> => {
    const response = await api.get<ApiResponse<ExchangeRate[]>>(API_ROUTES.RATES.BASE);
    return response.data.data;
  },

  getCurrencies: async (): Promise<any[]> => {
    try {
      const response = await api.get<ApiResponse<ExchangeRate[]>>(API_ROUTES.RATES.BASE);
      const rates = response.data.data;
      
      // Extrair moedas únicas de from_currency e to_currency
      const currencyMap = new Map<string, any>();
      rates.forEach(rate => {
        if (rate.from_currency) currencyMap.set(rate.from_currency.code, rate.from_currency);
        if (rate.to_currency) currencyMap.set(rate.to_currency.code, rate.to_currency);
      });
      
      const activeCurrencies = Array.from(currencyMap.values());
      if (activeCurrencies.length > 0) return activeCurrencies;
      
      // If API returns no rates (meaning empty mapped currencies list), fallback to static list
      return FALLBACK_CURRENCIES;
    } catch {
      return FALLBACK_CURRENCIES;
    }
  },

  convert: async (params: { from: string; to: string; amount: number }): Promise<any> => {
    const response = await api.get<ApiResponse<any>>(API_ROUTES.RATES.CONVERT, { params });
    return response.data.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>(API_ROUTES.RATES.DASHBOARD);
    return response.data.data;
  },
};
