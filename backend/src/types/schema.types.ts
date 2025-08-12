import { Document } from 'mongoose';

export interface PortfolioDocument extends Document {
  userId: string;
  stocks: Array<{
    symbol: string;
    companyName: string;
    addedAt: Date;
  }>;
}
