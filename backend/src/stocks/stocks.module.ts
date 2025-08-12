import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { FMPClient } from '../infrastructure/clients/fmp-client';
import {
  StockSearchCache,
  StockSearchCacheSchema,
} from './schemas/stock-search-cache.schema';
import {
  StockQuoteCache,
  StockQuoteCacheSchema,
} from './schemas/stock-quote-cache.schema';
import { CacheService } from '../infrastructure/cache/cache.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockSearchCache.name, schema: StockSearchCacheSchema },
      { name: StockQuoteCache.name, schema: StockQuoteCacheSchema },
    ]),
  ],
  controllers: [StocksController],
  providers: [StocksService, FMPClient, CacheService],
  exports: [StocksService],
})
export class StocksModule {}
