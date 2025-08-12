import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { StocksService } from '../stocks/stocks.service';
import { PortfolioWithQuotes, AddStockDto } from '../types';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
    private stocksService: StocksService,
  ) {}

  async getPortfolio(userId: string = 'default'): Promise<PortfolioWithQuotes> {
    let portfolio = await this.portfolioModel.findOne({ userId }).lean().exec();

    if (!portfolio) {
      portfolio = await this.portfolioModel.create({
        userId,
        stocks: [],
      });
    }

    const stocksWithQuotes = await this.getStocksWithQuotes(portfolio.stocks);

    const totalValue = stocksWithQuotes.reduce((sum, stock) => {
      return sum + (stock.quote?.price || 0);
    }, 0);

    const totalChange = stocksWithQuotes.reduce((sum, stock) => {
      return sum + (stock.quote?.change || 0);
    }, 0);

    const totalChangePercent =
      totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

    return {
      userId: portfolio.userId,
      stocks: stocksWithQuotes,
      totalValue,
      totalChange,
      totalChangePercent,
    };
  }

  async addStockToPortfolio(
    userId: string,
    addStockDto: AddStockDto,
  ): Promise<PortfolioWithQuotes> {
    const portfolio = await this.portfolioModel.findOne({ userId }).exec();

    if (!portfolio) {
      const newPortfolio = await this.portfolioModel.create({
        userId,
        stocks: [addStockDto],
      });
      return this.getPortfolio(userId);
    }

    // Check if stock already exists in portfolio
    const stockExists = portfolio.stocks.some(
      (stock) =>
        stock.symbol.toUpperCase() === addStockDto.symbol.toUpperCase(),
    );

    if (stockExists) {
      throw new ConflictException('Stock already exists in portfolio');
    }

    portfolio.stocks.push({
      symbol: addStockDto.symbol.toUpperCase(),
      companyName: addStockDto.companyName,
      addedAt: new Date(),
    });

    await portfolio.save();
    return this.getPortfolio(userId);
  }

  async removeStockFromPortfolio(
    userId: string,
    symbol: string,
  ): Promise<PortfolioWithQuotes> {
    console.log(
      `🔍 Attempting to remove stock: "${symbol}" for user: "${userId}"`,
    );

    const portfolio = await this.portfolioModel.findOne({ userId }).exec();

    if (!portfolio) {
      console.log(`❌ Portfolio not found for user: "${userId}"`);
      throw new NotFoundException('Portfolio not found');
    }

    console.log(
      `📊 Current stocks in portfolio:`,
      portfolio.stocks.map((s) => s.symbol),
    );
    console.log(`🎯 Looking for symbol: "${symbol}"`);

    const initialLength = portfolio.stocks.length;
    portfolio.stocks = portfolio.stocks.filter((stock) => {
      const matches = stock.symbol.toUpperCase() !== symbol.toUpperCase();
      console.log(
        `Comparing "${stock.symbol}" with "${symbol}" -> ${matches ? 'KEEP' : 'REMOVE'}`,
      );
      return matches;
    });

    if (portfolio.stocks.length === initialLength) {
      console.log(`❌ Stock "${symbol}" not found in portfolio`);
      throw new NotFoundException('Stock not found in portfolio');
    }

    console.log(`✅ Stock "${symbol}" removed successfully`);
    await portfolio.save();
    return this.getPortfolio(userId);
  }

  private async getStocksWithQuotes(
    stocks: Array<{ symbol: string; companyName: string; addedAt: Date }>,
  ) {
    if (stocks.length === 0) {
      return [];
    }

    const symbols = stocks.map((stock) => stock.symbol);
    console.log(`📈 Getting quotes for symbols:`, symbols);
    const quotes = await this.stocksService.getMultipleStockQuotes(symbols);
    console.log(
      `📊 Received quotes:`,
      quotes.map((q) => ({ symbol: q.symbol, price: q.price })),
    );

    return stocks.map((stock) => {
      const quote = quotes.find(
        (q) => q.symbol.toUpperCase() === stock.symbol.toUpperCase(),
      );
      console.log(
        `🔗 Mapping stock "${stock.symbol}" to quote:`,
        quote ? quote.symbol : 'NOT FOUND',
      );
      
      return {
        ...stock,
        quote,
      };
    });
  }
}
