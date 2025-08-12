import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockSearchCacheDocument = StockSearchCache & Document;

@Schema({ timestamps: true, collection: 'stock_search_caches' })
export class StockSearchCache {
  @Prop({ required: true, unique: true })
  query: string;

  @Prop([
    {
      symbol: { type: String, required: true },
      name: { type: String, required: true },
      exchange: { type: String, required: true },
      assetType: { type: String, required: true },
    },
  ])
  results: Array<{
    symbol: string;
    name: string;
    exchange: string;
    assetType: string;
  }>;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const StockSearchCacheSchema =
  SchemaFactory.createForClass(StockSearchCache);
