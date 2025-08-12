export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  companyName: string;
  marketCap: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
}

export interface PortfolioStock {
  symbol: string;
  companyName: string;
  addedAt: string;
  quote?: StockQuote;
}

export interface Portfolio {
  userId: string;
  stocks: PortfolioStock[];
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
}

export interface AddStockRequest {
  symbol: string;
  companyName: string;
}
