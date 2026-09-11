import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "../api/client";
import { formatCurrency } from "../utils/currency";
import { StockStatusChip } from "../components/StatusChip";

interface Category {
  id: string;
  name: string;
}
interface Product {
  id: string;
  sku: string;
  name: string;
  price: string;
  unit: string;
  availableQty: number;
  minStockLevel: number;
  stockStatus: string;
  imageUrl?: string;
  categoryId: string;
  category: Category;
  isActive: boolean;
}

const emptyForm = {
  sku: "",
  name: "",
  categoryId: "",
  price: "",
  unit: "",
  availableQty: "0",
  minStockLevel: "5",
  brand: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function loadProducts() {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    const res = await api.get("/products", { params });
    setProducts(res.data.items);
  }

  async function loadCategories() {
    const res = await api.get("/categories", { params: { activeOnly: "true" } });
    setCategories(res.data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      sku: p.sku,
      name: p.name,
      categoryId: p.categoryId,
      price: p.price,
      unit: p.unit,
      availableQty: String(p.availableQty),
      minStockLevel: String(p.minStockLevel),
      brand: "",
    });
    setImageFile(null);
    setOpen(true);
  }

  async function handleSave() {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);

    if (editing) {
      await api.put(`/products/${editing.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    } else {
      await api.post("/products", fd, { headers: { "Content-Type": "multipart/form-data" } });
    }
    setOpen(false);
    await loadProducts();
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Add Product
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search name, SKU, brand"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadProducts()}
          sx={{ minWidth: 300 }}
        />
        <Select size="small" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} displayEmpty sx={{ minWidth: 180 }}>
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell />
              <TableCell>SKU</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price (₹)</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Avatar variant="rounded" src={p.imageUrl} sx={{ bgcolor: "background.default" }}>
                    {p.name.charAt(0)}
                  </Avatar>
                </TableCell>
                <TableCell>{p.sku}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                <TableCell>{p.category?.name}</TableCell>
                <TableCell align="right">
                  {formatCurrency(p.price)} / {p.unit}
                </TableCell>
                <TableCell align="right">{p.availableQty}</TableCell>
                <TableCell>
                  <StockStatusChip status={p.stockStatus} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => openEdit(p)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!products.length && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} fullWidth />
          <TextField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <Select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} displayEmpty fullWidth>
            <MenuItem value="" disabled>
              Select category
            </MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth />
            <TextField label="Unit (kg, pack...)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} fullWidth />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Available Qty"
              type="number"
              value={form.availableQty}
              onChange={(e) => setForm({ ...form, availableQty: e.target.value })}
              fullWidth
            />
            <TextField
              label="Min Stock Level"
              type="number"
              value={form.minStockLevel}
              onChange={(e) => setForm({ ...form, minStockLevel: e.target.value })}
              fullWidth
            />
          </Box>
          <TextField label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} fullWidth />
          <Button component="label" variant="outlined">
            {imageFile ? imageFile.name : "Upload Image"}
            <input type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
