import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { api } from "../api/client";
import { StockStatusChip } from "../components/StatusChip";

interface Product {
  id: string;
  sku: string;
  name: string;
  availableQty: number;
  minStockLevel: number;
  stockStatus: string;
  unit: string;
}

interface Txn {
  id: string;
  type: string;
  quantity: number;
  reason?: string;
  createdAt: string;
  product: { name: string; sku: string };
}

export default function Inventory() {
  const [tab, setTab] = useState(0);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [history, setHistory] = useState<Txn[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ productId: "", type: "STOCK_IN", quantity: "", reason: "" });

  async function loadLowStock() {
    const res = await api.get("/inventory/low-stock");
    setLowStock(res.data);
  }
  async function loadHistory() {
    const res = await api.get("/inventory/history");
    setHistory(res.data.items);
  }
  async function loadProducts() {
    const res = await api.get("/products", { params: { pageSize: 100 } });
    setAllProducts(res.data.items);
  }

  useEffect(() => {
    loadLowStock();
    loadHistory();
    loadProducts();
  }, []);

  async function submitAdjustment() {
    await api.post("/inventory/adjust", {
      productId: form.productId,
      type: form.type,
      quantity: Number(form.quantity),
      reason: form.reason,
    });
    setOpen(false);
    setForm({ productId: "", type: "STOCK_IN", quantity: "", reason: "" });
    await Promise.all([loadLowStock(), loadHistory(), loadProducts()]);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Inventory</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Stock Adjustment
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Low / Out of Stock" />
        <Tab label="Transaction History" />
      </Tabs>

      {tab === 0 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Min Level</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStock.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                  <TableCell align="right">
                    {p.availableQty} {p.unit}
                  </TableCell>
                  <TableCell align="right">{p.minStockLevel}</TableCell>
                  <TableCell>
                    <StockStatusChip status={p.stockStatus} />
                  </TableCell>
                </TableRow>
              ))}
              {!lowStock.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    All products are sufficiently stocked. 🎉
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {tab === 1 && (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell>Date</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Qty Change</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id} hover>
                  <TableCell>{new Date(h.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{h.product.name}</TableCell>
                  <TableCell>{h.type.replace(/_/g, " ")}</TableCell>
                  <TableCell align="right" sx={{ color: h.quantity < 0 ? "error.main" : "success.main", fontWeight: 600 }}>
                    {h.quantity > 0 ? `+${h.quantity}` : h.quantity}
                  </TableCell>
                  <TableCell>{h.reason ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Stock Adjustment</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} displayEmpty>
            <MenuItem value="" disabled>
              Select product
            </MenuItem>
            {allProducts.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </MenuItem>
            ))}
          </Select>
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <MenuItem value="STOCK_IN">Stock In</MenuItem>
            <MenuItem value="STOCK_OUT">Stock Out</MenuItem>
            <MenuItem value="ADJUSTMENT">Manual Adjustment</MenuItem>
          </Select>
          <TextField label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          <TextField label="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAdjustment} disabled={!form.productId || !form.quantity}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
