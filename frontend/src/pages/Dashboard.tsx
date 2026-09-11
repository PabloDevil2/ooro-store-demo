import { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../api/client";
import { formatCurrency } from "../utils/currency";

interface Overview {
  todayOrders: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  delivered: number;
  cancelled: number;
  lowStock: number;
  outOfStock: number;
  todaySales: number;
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderTop: `3px solid ${accent ?? "#1F4D3A"}` }}>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [sales, setSales] = useState<Array<{ date: string; total: number }>>([]);

  useEffect(() => {
    api.get("/reports/overview").then((res) => setOverview(res.data));
    api.get("/reports/sales?range=weekly").then((res) => setSales(res.data.byDay));
  }, []);

  if (!overview) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Today's Orders" value={overview.todayOrders} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Today's Sales" value={formatCurrency(overview.todaySales)} accent="#E3A008" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Low Stock Items" value={overview.lowStock} accent="#E3A008" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Out of Stock" value={overview.outOfStock} accent="#C1443C" />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Order Pipeline
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Pending" value={overview.pending} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Confirmed" value={overview.confirmed} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Preparing" value={overview.preparing} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Ready" value={overview.ready} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Delivered Today" value={overview.delivered} accent="#2E7D5B" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Cancelled Today" value={overview.cancelled} accent="#C1443C" />
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Sales — Last 7 Days
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E1E5DC" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Sales"]} />
            <Line type="monotone" dataKey="total" stroke="#1F4D3A" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
