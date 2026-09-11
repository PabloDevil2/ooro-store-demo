import { Box, Typography, Paper, Grid, TextField, Divider } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Settings
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3, maxWidth: 500 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Your Account
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Name" value={user?.name ?? ""} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" value={user?.email ?? ""} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Role" value={user?.role === "SUPER_ADMIN" ? "Super Admin" : "Store Staff"} fullWidth disabled />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, maxWidth: 500 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Store Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Delivery charges, business hours, and other store-wide settings are configured via backend
          environment variables (see <code>DEFAULT_DELIVERY_CHARGE</code> in <code>.env</code>) to keep
          configuration auditable and version-controlled.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Category and product management are available from the Categories and Products pages.
        </Typography>
      </Paper>
    </Box>
  );
}
