import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { StockQuote, StockSearchResult } from '../../types';

export interface FMPStockData {
  symbol: string;
  price: number;
  change: number;
  changePercentage: number;
  name: string;
  marketCap: number;
  volume: number;
  dayHigh: number;
  dayLow: number;
  open: number;
  previousClose: number;
}

export interface FMPSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  assetType: string;
}

@Injectable()
export class FMPClient {
  private readonly apiKey = process.env.FINANCIAL_MODELING_PREP_API_KEY;
  private readonly baseUrl = 'https://financialmodelingprep.com/stable';

  private mapStockData(stockData: FMPStockData): StockQuote {
    return {
      symbol: stockData.symbol,
      price: stockData.price,
      change: stockData.change,
      changePercent: stockData.changePercentage,
      companyName: stockData.name,
      marketCap: stockData.marketCap,
      volume: stockData.volume,
      high: stockData.dayHigh,
      low: stockData.dayLow,
      open: stockData.open,
      previousClose: stockData.previousClose,
    };
  }

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/quote?symbol=${symbol}&apikey=${this.apiKey}`,
      );

      if (!response.data || response.data.length === 0) {
        throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
      }

      const stockData = response.data[0];
      return this.mapStockData(stockData);
    } catch (error) {
      if (error.response?.status === 429) {
        throw new HttpException(
          'API rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Failed to fetch stock data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/search-name?query=${query}&apikey=${this.apiKey}`,
      );

      if (!response.data) {
        return [];
      }

      return response.data.slice(0, 10).map((item: FMPSearchResult) => ({
        symbol: item.symbol,
        name: item.name,
        exchange: item.exchange,
        assetType: item.assetType,
      }));
    } catch (error) {
      if (error.response?.status === 429) {
        throw new HttpException(
          'API rate limit exceeded',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Failed to search stocks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
