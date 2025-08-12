import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Link,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { PortfolioStock } from "../types";
import { useState } from "react";

interface StockCardProps {
  stock: PortfolioStock;
  onRemove?: (symbol: string) => void;
  showRemoveButton?: boolean;
  isRemoving?: boolean;
}

const StockCard = ({
  stock,
  onRemove,
  showRemoveButton = false,
  isRemoving = false,
}: StockCardProps) => {
  const { quote } = stock;
  const isPositive = quote && quote.change >= 0;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const handleRemoveClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    console.log("Confirming removal for:", stock.symbol);
    if (stock.symbol) {
      onRemove?.(stock.symbol);
    }
    setConfirmDialogOpen(false);
  };

  const handleCancelRemove = () => {
    setConfirmDialogOpen(false);
  };

  const handleCardClick = (event: React.MouseEvent) => {
    // Don't navigate if clicking on the remove button
    if ((event.target as HTMLElement).closest("[data-remove-button]")) {
      return;
    }
    navigate(`/stock/${stock.symbol}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          backgroundColor: "#fafafa",
        },
        "&:active": {
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: "relative", p: 2 }}>
        {showRemoveButton && onRemove && (
          <IconButton
            size="small"
            disabled={isRemoving}
            onClick={handleRemoveClick}
            data-remove-button="true"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: isRemoving ? "text.disabled" : "error.main",
              backgroundColor: "rgba(255,255,255,0.8)",
              zIndex: 1,
              "&:hover": {
                backgroundColor: isRemoving
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.9)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {isRemoving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <DeleteIcon />
            )}
          </IconButton>
        )}

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {stock.symbol}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {stock.companyName}
        </Typography>

        {quote ? (
          <Box>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#000",
                transition: "color 0.3s ease-in-out",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              {formatCurrency(quote.price)}
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={`${isPositive ? "+" : ""}${formatCurrency(quote.change)}`}
                size="small"
                color={isPositive ? "success" : "error"}
                variant="outlined"
                sx={{
                  borderColor: isPositive ? "success.main" : "error.main",
                  color: isPositive ? "success.main" : "error.main",
                  fontWeight: "bold",
                }}
              />
              <Chip
                label={formatPercentage(quote.changePercent)}
                size="small"
                color={isPositive ? "success" : "error"}
                variant="outlined"
                sx={{
                  borderColor: isPositive ? "success.main" : "error.main",
                  color: isPositive ? "success.main" : "error.main",
                  fontWeight: "bold",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Vol: {quote.volume.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Market Cap: {formatCurrency(quote.marketCap)}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        )}
      </CardContent>

      <Dialog open={confirmDialogOpen} onClose={handleCancelRemove}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          Are you sure you want to remove {stock.symbol} from your portfolio?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRemove}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default StockCard;
