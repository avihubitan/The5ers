import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { StockQuote, StockSearchResult } from '../types';
import { FMPClient } from '../infrastructure/clients/fmp-client';
import { CacheService } from '../infrastructure/cache/cache.service';

@Injectable()
export class StocksService {
  constructor(
    private fmpClient: FMPClient,
    private cacheService: CacheService,
  ) {}

  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      const cachedQuote = await this.cacheService.getCachedStockQuote(symbol);
      if (cachedQuote) {
        return cachedQuote;
      }

      console.log(`🌐 Calling API for stock quote: ${symbol}`);
      const quote = await this.fmpClient.getStockQuote(symbol);

      await this.cacheService.setStockQuoteCache(symbol, quote);

      return quote;
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
      const cachedResults =
        await this.cacheService.getCachedSearchResults(query);
      if (cachedResults) {
        return cachedResults;
      }

      console.log(`🌐 Calling API for query: "${query}"`);
      const apiResults = await this.fmpClient.searchStocks(query);

      if (apiResults.length === 0) {
        console.log(`⚠️ No data returned from API for query: "${query}"`);
        return [];
      }

      // Cache the results
      await this.cacheService.setSearchResultsCache(query, apiResults);

      return apiResults;
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

  async getMultipleStockQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const { cachedQuotes, symbolsToFetch } =
        await this.cacheService.getMultipleCachedStockQuotes(symbols);

      if (symbolsToFetch.length > 0) {
        console.log(`🌐 Fetching quotes for: ${symbolsToFetch.join(', ')}`);

        for (const symbol of symbolsToFetch) {
          try {
            const quote = await this.fmpClient.getStockQuote(symbol);
            await this.cacheService.setStockQuoteCache(symbol, quote);
            cachedQuotes.push(quote);
          } catch (error) {
            console.error(
              `Failed to fetch quote for ${symbol}:`,
              error.message,
            );
          }
        }
      }

      return cachedQuotes;
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

  async clearOldCacheEntries(daysOld: number = 7): Promise<number> {
    return this.cacheService.clearOldCacheEntries(daysOld);
  }

  async getCacheStats(): Promise<{
    searchEntries: number;
    searchResults: number;
    quoteEntries: number;
  }> {
    return this.cacheService.getCacheStats();
  }

  async clearCacheForQuery(query: string): Promise<boolean> {
    return this.cacheService.clearCacheForQuery(query);
  }

  async clearCacheForSymbol(symbol: string): Promise<boolean> {
    return this.cacheService.clearCacheForSymbol(symbol);
  }

  async clearAllQuoteCache(): Promise<number> {
    return this.cacheService.clearAllQuoteCache();
  }
}
