import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StockQuoteCacheDocument = StockQuoteCache & Document;

@Schema({ _id: false })
class StockQuoteData {
  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  change: number;

  @Prop({ required: true })
  changePercent: number;

  @Prop({ required: true })
  companyName: string;

  @Prop()
  marketCap?: number;

  @Prop()
  volume?: number;

  @Prop()
  high?: number;

  @Prop()
  low?: number;

  @Prop()
  open?: number;

  @Prop()
  previousClose?: number;
}

const StockQuoteDataSchema = SchemaFactory.createForClass(StockQuoteData);

@Schema({ timestamps: true, collection: 'stock_quote_caches' })
export class StockQuoteCache {
  @Prop({ required: true, unique: true })
  symbol: string;

  @Prop({ type: StockQuoteDataSchema, required: true })
  quote: StockQuoteData;

  @Prop({ default: Date.now })
  lastUpdated: Date;

  @Prop({ default: Date.now })
  cacheDate: Date;
}

export const StockQuoteCacheSchema =
  SchemaFactory.createForClass(StockQuoteCache);

StockQuoteCacheSchema.index({ symbol: 1 }, { unique: true });
StockQuoteCacheSchema.index({ lastUpdated: -1 });
StockQuoteCacheSchema.index({ cacheDate: 1 });
