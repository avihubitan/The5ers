import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { PortfolioWithQuotes, AddStockDto } from '../types';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get user portfolio with stock quotes' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID (defaults to "default")' })
  @ApiResponse({ status: 200, description: 'Portfolio retrieved successfully' })
  async getPortfolio(@Query('userId') userId: string = 'default'): Promise<PortfolioWithQuotes> {
    return this.portfolioService.getPortfolio(userId);
  }

  @Post('stocks')
  @ApiOperation({ summary: 'Add stock to portfolio' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID (defaults to "default")' })
  @ApiResponse({ status: 201, description: 'Stock added to portfolio successfully' })
  @ApiResponse({ status: 409, description: 'Stock already exists in portfolio' })
  async addStockToPortfolio(
    @Query('userId') userId: string = 'default',
    @Body() addStockDto: AddStockDto,
  ): Promise<PortfolioWithQuotes> {
    return this.portfolioService.addStockToPortfolio(userId, addStockDto);
  }

  @Delete('stocks/:symbol')
  @ApiOperation({ summary: 'Remove stock from portfolio' })
  @ApiParam({ name: 'symbol', description: 'Stock symbol to remove' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID (defaults to "default")' })
  @ApiResponse({ status: 200, description: 'Stock removed from portfolio successfully' })
  @ApiResponse({ status: 404, description: 'Stock not found in portfolio' })
  async removeStockFromPortfolio(
    @Param('symbol') symbol: string,
    @Query('userId') userId: string = 'default',
  ): Promise<PortfolioWithQuotes> {
    return this.portfolioService.removeStockFromPortfolio(userId, symbol);
  }
}
