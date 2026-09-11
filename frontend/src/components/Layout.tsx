import { ReactNode } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import OrdersIcon from "@mui/icons-material/ReceiptLong";
import ProductsIcon from "@mui/icons-material/Storefront";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory2";
import CustomersIcon from "@mui/icons-material/People";
import ReportsIcon from "@mui/icons-material/BarChart";
import StaffIcon from "@mui/icons-material/Badge";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Orders", path: "/orders", icon: <OrdersIcon /> },
  { label: "Products", path: "/products", icon: <ProductsIcon /> },
  { label: "Categories", path: "/categories", icon: <CategoryIcon /> },
  { label: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
  { label: "Customers", path: "/customers", icon: <CustomersIcon /> },
  { label: "Reports", path: "/reports", icon: <ReportsIcon /> },
  { label: "Staff", path: "/staff", icon: <StaffIcon /> },
  { label: "WhatsApp Settings", path: "/whatsapp-settings", icon: <WhatsAppIcon /> },
  { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
];

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: "border-box", borderRight: "1px solid #E1E5DC" },
        }}
      >
        <Toolbar sx={{ px: 3, py: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ letterSpacing: 0.5 }}>
              Ooro Store
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Staff Dashboard
            </Typography>
          </Box>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1, py: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": { bgcolor: "primary.main", color: "primary.contrastText", "& .MuiListItemIcon-root": { color: "primary.contrastText" } },
                "&.Mui-selected:hover": { bgcolor: "primary.dark" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}>{item.label}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" color="inherit" sx={{ bgcolor: "background.paper" }}>
          <Toolbar sx={{ justifyContent: "flex-end", gap: 2 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" fontWeight={600}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role === "SUPER_ADMIN" ? "Super Admin" : "Store Staff"}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}>
              {user?.name?.charAt(0) ?? "?"}
            </Avatar>
            <IconButton onClick={logout} title="Log out">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3, flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
}
