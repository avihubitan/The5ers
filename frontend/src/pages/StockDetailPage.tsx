import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { stockApi, portfolioApi } from '../services/api';
import { StockQuote } from '../types';

const StockDetailPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInPortfolio, setIsInPortfolio] = useState(false);

  const loadStockData = async () => {
    if (!symbol) return;

    try {
      setLoading(true);
      setError('');
      const data = await stockApi.getQuote(symbol);
      setStock(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Stock not found. Please check the symbol and try again.');
      } else {
        setError('Failed to load stock data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPortfolioStatus = async () => {
    try {
      const portfolio = await portfolioApi.getPortfolio();
      const exists = portfolio.stocks.some(s => s.symbol.toUpperCase() === symbol?.toUpperCase());
      setIsInPortfolio(exists);
    } catch (err) {
      // Silently handle portfolio check errors
    }
  };

  useEffect(() => {
    loadStockData();
    checkPortfolioStatus();
  }, [symbol]);

  const handleAddToPortfolio = async () => {
    if (!stock) return;

    try {
      await portfolioApi.addStock({
        symbol: stock.symbol,
        companyName: stock.companyName,
      });
      setIsInPortfolio(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add stock to portfolio.');
    }
  };

  const handleRemoveFromPortfolio = async () => {
    if (!stock) return;

    try {
      await portfolioApi.removeStock(stock.symbol);
      setIsInPortfolio(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove stock from portfolio.');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !stock) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Portfolio
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stock) {
    return null;
  }

  const isPositive = stock.change >= 0;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Portfolio
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {stock.symbol}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {stock.companyName}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatCurrency(stock.price)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              {isPositive ? (
                <TrendingUpIcon sx={{ color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ color: 'error.main' }} />
              )}
              <Chip
                label={`${isPositive ? '+' : ''}${formatCurrency(stock.change)}`}
                color={isPositive ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={formatPercentage(stock.changePercent)}
                color={isPositive ? 'success' : 'error'}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {isInPortfolio ? (
            <Button
              variant="outlined"
              color="error"
              onClick={handleRemoveFromPortfolio}
            >
              Remove from Portfolio
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleAddToPortfolio}
            >
              Add to Portfolio
            </Button>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Trading Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Previous Close
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stock.previousClose)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Open
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stock.open)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Day High
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stock.high)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Day Low
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stock.low)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Market Data
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Volume
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(stock.volume)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Market Cap
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(stock.marketCap)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDetailPage;
