import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import { api } from "../api/client";
import { formatCurrency } from "../utils/currency";
import { OrderStatusChip } from "../components/StatusChip";

const STATUSES = ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: { name: string; unit: string };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  grandTotal: string;
  deliveryType: string;
  paymentStatus: string;
  createdAt: string;
  customer: { name: string; whatsappPhone: string };
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  async function load() {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (search) params.search = search;
    const res = await api.get("/orders", { params });
    setOrders(res.data.items);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function updateStatus(orderId: string, newStatus: string) {
    await api.patch(`/orders/${orderId}/status`, { status: newStatus });
    await load();
    setSelected(null);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Orders
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search order #, customer, phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          sx={{ minWidth: 300 }}
        />
        <Select size="small" value={status} onChange={(e) => setStatus(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
          <MenuItem value="">All Statuses</MenuItem>
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s.replace(/_/g, " ")}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Delivery</TableCell>
              <TableCell align="right">Total (₹)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id} hover sx={{ cursor: "pointer" }} onClick={() => setSelected(o)}>
                <TableCell sx={{ fontWeight: 600 }}>{o.orderNumber}</TableCell>
                <TableCell>
                  {o.customer.name}
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    {o.customer.whatsappPhone}
                  </Typography>
                </TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip size="small" label={o.deliveryType} variant="outlined" />
                </TableCell>
                <TableCell align="right">{formatCurrency(o.grandTotal)}</TableCell>
                <TableCell>
                  <OrderStatusChip status={o.status} />
                </TableCell>
              </TableRow>
            ))}
            {!orders.length && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        {selected && (
          <>
            <DialogTitle>Order {selected.orderNumber}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>{selected.customer.name}</strong> — {selected.customer.whatsappPhone}
              </Typography>
              <Table size="small" sx={{ mb: 2 }}>
                <TableBody>
                  {selected.items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>
                        {it.quantity} x {it.product.name}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(it.lineTotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6">Total: {formatCurrency(selected.grandTotal)}</Typography>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
                Update status
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="small"
                    variant={selected.status === s ? "contained" : "outlined"}
                    onClick={() => updateStatus(selected.id, s)}
                  >
                    {s.replace(/_/g, " ")}
                  </Button>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
