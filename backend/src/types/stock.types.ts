export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  companyName: string;
  marketCap?: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
}
