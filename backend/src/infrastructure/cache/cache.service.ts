import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockQuote, StockSearchResult } from '../../types';
import {
  StockSearchCache,
  StockSearchCacheDocument,
} from '../../stocks/schemas/stock-search-cache.schema';
import {
  StockQuoteCache,
  StockQuoteCacheDocument,
} from '../../stocks/schemas/stock-quote-cache.schema';

@Injectable()
export class CacheService {
  constructor(
    @InjectModel(StockSearchCache.name)
    private stockSearchCacheModel: Model<StockSearchCacheDocument>,
    @InjectModel(StockQuoteCache.name)
    private stockQuoteCacheModel: Model<StockQuoteCacheDocument>,
  ) {}

  private isQuoteCacheValid(cacheDate: Date): boolean {
    const today = new Date();
    const cacheDay = new Date(cacheDate);

    return (
      today.getFullYear() === cacheDay.getFullYear() &&
      today.getMonth() === cacheDay.getMonth() &&
      today.getDate() === cacheDay.getDate()
    );
  }

  private isSearchCacheValid(
    lastUpdated: Date,
    maxAgeMs: number = 7 * 24 * 60 * 60 * 1000,
  ): boolean {
    const cacheAge = Date.now() - lastUpdated.getTime();
    return cacheAge < maxAgeMs;
  }

  async getCachedStockQuote(symbol: string): Promise<StockQuote | null> {
    const cachedQuote = await this.stockQuoteCacheModel.findOne({ symbol });

    if (cachedQuote && this.isQuoteCacheValid(cachedQuote.cacheDate)) {
      console.log(`✅ Cache HIT: Returning cached quote for ${symbol}`);
      return cachedQuote.quote;
    }

    console.log(`❌ Cache MISS: No valid cached quote for ${symbol}`);
    return null;
  }

  async setStockQuoteCache(symbol: string, quote: StockQuote): Promise<void> {
    await this.stockQuoteCacheModel.findOneAndUpdate(
      { symbol },
      {
        symbol,
        quote,
        lastUpdated: new Date(),
        cacheDate: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log(`💾 Cached quote for ${symbol}`);
  }

  async getCachedSearchResults(
    query: string,
  ): Promise<StockSearchResult[] | null> {
    const cachedResult = await this.stockSearchCacheModel.findOne({ query });

    if (cachedResult && cachedResult.results.length >= 5) {
      if (this.isSearchCacheValid(cachedResult.lastUpdated)) {
        const cacheAge = Date.now() - cachedResult.lastUpdated.getTime();
        console.log(
          `✅ Cache HIT: Returning ${cachedResult.results.length} cached results for query: "${query}" (cache age: ${Math.round(cacheAge / (1000 * 60 * 60))} hours)`,
        );
        return cachedResult.results;
      } else {
        const cacheAge = Date.now() - cachedResult.lastUpdated.getTime();
        console.log(
          `⏰ Cache EXPIRED: Cache for query "${query}" is ${Math.round(cacheAge / (1000 * 60 * 60 * 24))} days old, will refresh`,
        );
      }
    } else if (cachedResult) {
      console.log(
        `📊 Cache INSUFFICIENT: Found ${cachedResult.results.length} cached results for query "${query}", need at least 5`,
      );
    } else {
      console.log(
        `❌ Cache MISS: No cached results found for query: "${query}"`,
      );
    }

    return null;
  }

  async setSearchResultsCache(
    query: string,
    results: StockSearchResult[],
  ): Promise<void> {
    await this.stockSearchCacheModel.findOneAndUpdate(
      { query },
      {
        query,
        results,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log(`💾 Cached ${results.length} results for query: "${query}"`);
  }

  async getMultipleCachedStockQuotes(symbols: string[]): Promise<{
    cachedQuotes: StockQuote[];
    symbolsToFetch: string[];
  }> {
    const cachedQuotes: StockQuote[] = [];
    const symbolsToFetch: string[] = [];

    for (const symbol of symbols) {
      const cachedQuote = await this.getCachedStockQuote(symbol);
      if (cachedQuote) {
        cachedQuotes.push(cachedQuote);
      } else {
        symbolsToFetch.push(symbol);
      }
    }

    return { cachedQuotes, symbolsToFetch };
  }

  async clearOldCacheEntries(daysOld: number = 7): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const searchResult = await this.stockSearchCacheModel.deleteMany({
      lastUpdated: { $lt: cutoffDate },
    });

    const quoteResult = await this.stockQuoteCacheModel.deleteMany({
      lastUpdated: { $lt: cutoffDate },
    });

    const totalDeleted = searchResult.deletedCount + quoteResult.deletedCount;
    console.log(
      `Cleared ${totalDeleted} old cache entries (${searchResult.deletedCount} search, ${quoteResult.deletedCount} quote)`,
    );
    return totalDeleted;
  }

  async getCacheStats(): Promise<{
    searchEntries: number;
    searchResults: number;
    quoteEntries: number;
  }> {
    const searchEntries = await this.stockSearchCacheModel.countDocuments();
    const searchResults = await this.stockSearchCacheModel.aggregate([
      {
        $group: {
          _id: null,
          totalResults: { $sum: { $size: '$results' } },
        },
      },
    ]);

    const quoteEntries = await this.stockQuoteCacheModel.countDocuments();

    return {
      searchEntries,
      searchResults: searchResults[0]?.totalResults || 0,
      quoteEntries,
    };
  }

  async clearCacheForQuery(query: string): Promise<boolean> {
    const result = await this.stockSearchCacheModel.deleteOne({ query });
    return result.deletedCount > 0;
  }

  async clearCacheForSymbol(symbol: string): Promise<boolean> {
    const result = await this.stockQuoteCacheModel.deleteOne({ symbol });
    return result.deletedCount > 0;
  }

  async clearAllQuoteCache(): Promise<number> {
    const result = await this.stockQuoteCacheModel.deleteMany({});
    console.log(`Cleared ${result.deletedCount} quote cache entries`);
    return result.deletedCount;
  }

  async cleanupDuplicateEntries(): Promise<{
    duplicatesFound: number;
    entriesRemoved: number;
  }> {
    console.log('🔍 Cleaning up duplicate stock quote cache entries...');

    // Find all documents grouped by symbol
    const duplicates = await this.stockQuoteCacheModel.aggregate([
      {
        $group: {
          _id: '$symbol',
          count: { $sum: 1 },
          documents: { $push: '$$ROOT' },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);

    if (duplicates.length === 0) {
      console.log('✅ No duplicate entries found!');
      return { duplicatesFound: 0, entriesRemoved: 0 };
    }

    console.log(`📊 Found ${duplicates.length} symbols with duplicate entries`);

    let totalRemoved = 0;

    for (const duplicate of duplicates) {
      const { _id: symbol, count, documents } = duplicate;

      // Sort by lastUpdated descending to keep the most recent
      const sortedDocs = documents.sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );

      // Keep the first (most recent) one, remove the rest
      const toRemove = sortedDocs.slice(1);

      for (const doc of toRemove) {
        await this.stockQuoteCacheModel.deleteOne({ _id: doc._id });
      }

      totalRemoved += toRemove.length;
      console.log(
        `   📈 ${symbol}: kept 1, removed ${toRemove.length} duplicates`,
      );
    }

    console.log(
      `🎉 Cleanup complete! Removed ${totalRemoved} duplicate entries.`,
    );

    return {
      duplicatesFound: duplicates.length,
      entriesRemoved: totalRemoved,
    };
  }
}
