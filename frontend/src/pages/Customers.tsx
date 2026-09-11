import { useEffect, useState } from "react";
import { Box, Typography, TextField, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { api } from "../api/client";

interface Customer {
  id: string;
  name: string;
  whatsappPhone: string;
  createdAt: string;
  _count: { orders: number };
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await api.get("/customers", { params: search ? { search } : {} });
    setCustomers(res.data.items);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Customers
      </Typography>
      <TextField
        size="small"
        placeholder="Search name or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && load()}
        sx={{ mb: 2, minWidth: 300 }}
      />
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Name</TableCell>
              <TableCell>WhatsApp Number</TableCell>
              <TableCell align="right">Orders</TableCell>
              <TableCell>Customer Since</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                <TableCell>{c.whatsappPhone}</TableCell>
                <TableCell align="right">{c._count.orders}</TableCell>
                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {!customers.length && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No customers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
