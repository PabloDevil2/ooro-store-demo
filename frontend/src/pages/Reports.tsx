import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Table, TableHead, TableRow, TableCell, TableBody, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { api } from "../api/client";
import { formatCurrency } from "../utils/currency";

interface TopProduct {
  product: { name: string; sku: string };
  quantitySold: number;
  revenue: number;
}

export default function Reports() {
  const [range, setRange] = useState("daily");
  const [sales, setSales] = useState({ totalRevenue: 0, orderCount: 0 });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [waStats, setWaStats] = useState({ totalWhatsAppOrders: 0, cancelledOrders: 0 });

  useEffect(() => {
    api.get("/reports/sales", { params: { range } }).then((r) => setSales(r.data));
  }, [range]);

  useEffect(() => {
    api.get("/reports/top-products").then((r) => setTopProducts(r.data));
    api.get("/reports/whatsapp-orders").then((r) => setWaStats(r.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Reports
      </Typography>

      <ToggleButtonGroup value={range} exclusive onChange={(_e, v) => v && setRange(v)} sx={{ mb: 2 }}>
        <ToggleButton value="daily">Daily</ToggleButton>
        <ToggleButton value="weekly">Weekly</ToggleButton>
        <ToggleButton value="monthly">Monthly</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Revenue ({range})
            </Typography>
            <Typography variant="h4">{formatCurrency(sales.totalRevenue)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Orders ({range})
            </Typography>
            <Typography variant="h4">{sales.orderCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Cancelled Orders (all-time)
            </Typography>
            <Typography variant="h4">{waStats.cancelledOrders}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Top Selling Products
      </Typography>
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Product</TableCell>
              <TableCell align="right">Qty Sold</TableCell>
              <TableCell align="right">Revenue (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topProducts.map((tp, i) => (
              <TableRow key={i} hover>
                <TableCell>{tp.product?.name}</TableCell>
                <TableCell align="right">{tp.quantitySold}</TableCell>
                <TableCell align="right">{formatCurrency(tp.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
