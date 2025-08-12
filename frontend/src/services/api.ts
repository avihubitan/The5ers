import axios from "axios";
import {
  StockQuote,
  StockSearchResult,
  Portfolio,
  AddStockRequest,
} from "../types";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Stock API
export const stockApi = {
  getQuote: async (symbol: string): Promise<StockQuote> => {
    const response = await api.get(`/stocks/quote/${symbol}`);
    return response.data;
  },

  search: async (query: string): Promise<StockSearchResult[]> => {
    const response = await api.get(
      `/stocks/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },

  getMultipleQuotes: async (symbols: string[]): Promise<StockQuote[]> => {
    const symbolsString = symbols.join(",");
    const response = await api.get(`/stocks/quotes?symbols=${symbolsString}`);
    return response.data;
  },
};

// Portfolio API
export const portfolioApi = {
  getPortfolio: async (userId: string = "default"): Promise<Portfolio> => {
    const response = await api.get(`/portfolio?userId=${userId}`);
    return response.data;
  },

  addStock: async (
    stock: AddStockRequest,
    userId: string = "default"
  ): Promise<Portfolio> => {
    const response = await api.post(
      `/portfolio/stocks?userId=${userId}`,
      stock
    );
    return response.data;
  },

  removeStock: async (
    symbol: string,
    userId: string = "default"
  ): Promise<Portfolio> => {
    console.log(
      `Making DELETE request to: /portfolio/stocks/${symbol}?userId=${userId}`
    );
    try {
      const response = await api.delete(
        `/portfolio/stocks/${symbol}?userId=${userId}`
      );
      console.log("Remove stock response:", response);
      return response.data;
    } catch (error) {
      console.error("Error in removeStock API call:", error);
      throw error;
    }
  },
};

export default api;
