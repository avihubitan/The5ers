import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PortfolioDocument } from '../../types';

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true, unique: true, default: 'default' })
  userId: string;

  @Prop([
    {
      symbol: { type: String, required: true },
      companyName: { type: String, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ])
  stocks: Array<{
    symbol: string;
    companyName: string;
    addedAt: Date;
  }>;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
export { PortfolioDocument };
