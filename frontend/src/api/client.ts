import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
});

// Demo mode keeps the dashboard reviewable without a local API/database.
// Production continues to use the configured REST API unchanged.
if (import.meta.env.VITE_DEMO_MODE === "true") {
  const user = { id: "demo-admin", name: "Ooro Super Admin", email: "admin@oorostore.com", role: "SUPER_ADMIN" };
  const sales = [
    { date: "Mon", total: 124 }, { date: "Tue", total: 186 }, { date: "Wed", total: 142 },
    { date: "Thu", total: 218 }, { date: "Fri", total: 271 }, { date: "Sat", total: 195 }, { date: "Sun", total: 244 },
  ];

  api.defaults.adapter = async (config) => {
    const url = config.url ?? "";
    const method = (config.method ?? "get").toLowerCase();
    let data: unknown = {};

    if (url === "/auth/login" && method === "post") {
      const credentials = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
      if (credentials.email !== "admin@oorostore.com" || credentials.password !== "Admin@12345") {
        return { data: { error: "Use admin@oorostore.com / Admin@12345 in demo mode." }, status: 401, statusText: "Unauthorized", headers: {}, config };
      }
      data = { token: "demo-token", user };
    } else if (url === "/reports/overview") {
      data = { todayOrders: 18, pending: 4, confirmed: 3, preparing: 2, ready: 3, delivered: 5, cancelled: 1, lowStock: 2, outOfStock: 1, todaySales: 244 };
    } else if (url.startsWith("/reports/sales")) {
      data = { totalRevenue: 1380, orderCount: 86, byDay: sales };
    } else if (url === "/reports/top-products") {
      data = [{ product: { name: "Basmati Rice 5kg", sku: "GRO-0001" }, quantitySold: 34, revenue: 441.66 }];
    } else if (url === "/reports/whatsapp-orders") {
      data = { totalWhatsAppOrders: 62, cancelledOrders: 3 };
    } else if (url === "/auth/users") {
      data = [{ ...user, isActive: true, createdAt: "2026-09-11T00:00:00.000Z" }];
    } else if (url === "/categories") {
      data = [{ id: "groceries", name: "Groceries", description: "Daily essentials", isActive: true, _count: { products: 2 } }];
    } else if (url === "/products") {
      data = { items: [{ id: "rice", sku: "GRO-0001", name: "Basmati Rice 5kg", price: "12.99", unit: "bag", availableQty: 40, minStockLevel: 10, stockStatus: "IN_STOCK", categoryId: "groceries", category: { id: "groceries", name: "Groceries" }, isActive: true }] };
    } else if (url === "/orders") {
      data = { items: [] };
    } else if (url === "/customers") {
      data = { items: [] };
    } else if (url === "/inventory/low-stock") {
      data = [];
    } else if (url === "/inventory/history") {
      data = { items: [] };
    }
    return { data, status: 200, statusText: "OK", headers: {}, config };
  };
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ooro_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ooro_token");
      localStorage.removeItem("ooro_user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
