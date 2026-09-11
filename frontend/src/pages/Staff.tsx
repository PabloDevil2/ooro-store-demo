import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "STAFF";
  isActive: boolean;
  createdAt: string;
}

export default function Staff() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [error, setError] = useState("");

  async function load() {
    const res = await api.get("/auth/users");
    setStaff(res.data);
  }

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") load();
  }, [user]);

  if (user?.role !== "SUPER_ADMIN") {
    return <Alert severity="warning">Only Super Admins can manage staff accounts.</Alert>;
  }

  async function handleSave() {
    try {
      await api.post("/auth/users", form);
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      setError("");
      await load();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Failed to create user");
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Staff</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Staff
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>
                  <Chip size="small" label={s.role === "SUPER_ADMIN" ? "Super Admin" : "Staff"} color={s.role === "SUPER_ADMIN" ? "secondary" : "default"} />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={s.isActive ? "Active" : "Inactive"} color={s.isActive ? "success" : "default"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Add Staff Member</DialogTitle>
        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
          <TextField label="Temporary password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth />
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="STAFF">Store Staff</MenuItem>
            <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.email || form.password.length < 6}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
