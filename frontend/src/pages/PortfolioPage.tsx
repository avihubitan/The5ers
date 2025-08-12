import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { portfolioApi } from "../services/api";
import { Portfolio } from "../types";
import StockCard from "../components/StockCard";
import AddStockDialog from "../components/AddStockDialog";

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [removingStocks, setRemovingStocks] = useState<Set<string>>(new Set());

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await portfolioApi.getPortfolio();
      setPortfolio(data);
    } catch (err) {
      setError("Failed to load portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleAddStock = async (symbol: string, companyName: string) => {
    try {
      const updatedPortfolio = await portfolioApi.addStock({
        symbol,
        companyName,
      });
      setPortfolio(updatedPortfolio);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to add stock. Please try again."
      );
    }
  };

  const handleRemoveStock = async (symbol: string) => {
    setError("");
    setSuccess("");

    setRemovingStocks((prev) => new Set(prev).add(symbol));

    try {
      const updatedPortfolio = await portfolioApi.removeStock(symbol);
      setPortfolio(updatedPortfolio);
      setSuccess(`${symbol} removed from portfolio successfully`);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to remove stock. Please try again."
      );
    } finally {
      setRemovingStocks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(symbol);
        return newSet;
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          My Portfolio
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add Stock
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {portfolio && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Portfolio Summary</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip
                label={`Total Value: ${formatCurrency(portfolio.totalValue)}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Change: ${formatCurrency(portfolio.totalChange)}`}
                color={portfolio.totalChange >= 0 ? "success" : "error"}
                variant="outlined"
              />
              <Chip
                label={formatPercentage(portfolio.totalChangePercent)}
                color={portfolio.totalChangePercent >= 0 ? "success" : "error"}
                variant="outlined"
              />
            </Box>
          </Box>
        </Paper>
      )}

      {portfolio && portfolio.stocks.length > 0 ? (
        <Grid container spacing={3}>
                     {portfolio.stocks.map((stock) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={stock.symbol}>
               <StockCard
                 stock={stock}
                 onRemove={handleRemoveStock}
                 showRemoveButton={true}
                 isRemoving={removingStocks.has(stock.symbol)}
               />
             </Grid>
           ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Your portfolio is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start building your portfolio by adding some stocks
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Add Your First Stock
          </Button>
        </Paper>
      )}

      <AddStockDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddStock}
      />
    </Box>
  );
};

export default PortfolioPage;
