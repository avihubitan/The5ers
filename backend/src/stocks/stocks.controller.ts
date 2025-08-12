import { Controller, Get, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { StockQuote, StockSearchResult } from '../types';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('quote/:symbol')
  @ApiOperation({ summary: 'Get stock quote by symbol' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol (e.g., AAPL, MSFT)' })
  @ApiResponse({
    status: 200,
    description: 'Stock quote retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  @ApiResponse({ status: 429, description: 'API rate limit exceeded' })
  async getStockQuote(@Param('symbol') symbol: string): Promise<StockQuote> {
    return this.stocksService.getStockQuote(symbol.toUpperCase());
  }

  @Get('search')
  @ApiOperation({ summary: 'Search stocks by query' })
  @ApiQuery({ name: 'q', description: 'Search query (company name)' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  @ApiResponse({ status: 429, description: 'API rate limit exceeded' })
  async searchStocks(@Query('q') query: string): Promise<StockSearchResult[]> {
    return this.stocksService.searchStocks(query);
  }
}
