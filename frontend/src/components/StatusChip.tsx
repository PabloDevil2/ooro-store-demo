import { Chip } from "@mui/material";

const STOCK_CONFIG: Record<string, { label: string; color: "success" | "warning" | "error" }> = {
  IN_STOCK: { label: "🟢 In Stock", color: "success" },
  LOW_STOCK: { label: "🟡 Low Stock", color: "warning" },
  OUT_OF_STOCK: { label: "🔴 Out of Stock", color: "error" },
};

const ORDER_CONFIG: Record<string, { label: string; color: "default" | "info" | "warning" | "success" | "error" }> = {
  NEW: { label: "New", color: "info" },
  CONFIRMED: { label: "Confirmed", color: "default" },
  PREPARING: { label: "Preparing", color: "warning" },
  READY: { label: "Ready", color: "warning" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "info" },
  DELIVERED: { label: "Delivered", color: "success" },
  CANCELLED: { label: "Cancelled", color: "error" },
};

export function StockStatusChip({ status }: { status: string }) {
  const cfg = STOCK_CONFIG[status] ?? { label: status, color: "default" as const };
  return <Chip size="small" label={cfg.label} color={cfg.color as any} variant="outlined" />;
}

export function OrderStatusChip({ status }: { status: string }) {
  const cfg = ORDER_CONFIG[status] ?? { label: status, color: "default" };
  return <Chip size="small" label={cfg.label} color={cfg.color as any} />;
}
