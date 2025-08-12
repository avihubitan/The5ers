import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { stockApi } from "../services/api";
import { StockSearchResult } from "../types";

interface AddStockDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (symbol: string, companyName: string) => void;
}

const AddStockDialog = ({ open, onClose, onAdd }: AddStockDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(
    null
  );

  useEffect(() => {
    const searchStocks = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const results = await stockApi.search(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError("Failed to search stocks. Please try again.");
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchStocks, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAdd = () => {
    if (selectedStock) {
      onAdd(selectedStock.symbol, selectedStock.name);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStock(null);
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Stock to Portfolio</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
            loading={loading}
            value={selectedStock}
            onChange={(_, newValue) => setSelectedStock(newValue)}
            onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search stocks"
                placeholder="Enter company name or symbol..."
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.symbol}>
                <Box>
                  <Box sx={{ fontWeight: "bold" }}>{option.symbol}</Box>
                  <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
                    {option.name}
                  </Box>
                  <Box sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                    {option.exchange} • {option.assetType}
                  </Box>
                </Box>
              </Box>
            )}
            noOptionsText={
              searchQuery.length < 2
                ? "Start typing to search..."
                : "No stocks found"
            }
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedStock}
        >
          Add Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockDialog;
