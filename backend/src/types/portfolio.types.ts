import { StockQuote } from './stock.types';

export interface PortfolioWithQuotes {
  userId: string;
  stocks: Array<{
    symbol: string;
    companyName: string;
    addedAt: Date;
    quote?: StockQuote;
  }>;
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
}

export interface PortfolioStock {
  symbol: string;
  companyName: string;
  addedAt: Date;
}
