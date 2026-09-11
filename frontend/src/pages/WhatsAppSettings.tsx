import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Chip, Alert, Divider, Link } from "@mui/material";
import { api } from "../api/client";

interface WaOverview {
  totalWhatsAppOrders: number;
}

export default function WhatsAppSettings() {
  const [stats, setStats] = useState<WaOverview | null>(null);

  useEffect(() => {
    api.get("/reports/whatsapp-orders").then((r) => setStats(r.data));
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        WhatsApp Settings
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        For security, WhatsApp Business API credentials (access token, phone number ID, app secret) are
        configured only as backend environment variables — never in the frontend or database. Update them in
        the backend's <code>.env</code> file and restart the server to apply changes.
      </Alert>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Total WhatsApp Orders Received
            </Typography>
            <Typography variant="h4">{stats?.totalWhatsAppOrders ?? "—"}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Webhook Endpoint
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: "monospace", mt: 1 }}>
              POST /api/whatsapp/webhook
            </Typography>
            <Chip size="small" label="Configure in Meta App Dashboard" sx={{ mt: 1 }} />
          </Paper>
        </Grid>
      </Grid>

      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Setup checklist
        </Typography>
        <Box component="ol" sx={{ pl: 3, "& li": { mb: 1.5 } }}>
          <li>
            Create a Meta App at{" "}
            <Link href="https://developers.facebook.com" target="_blank" rel="noreferrer">
              developers.facebook.com
            </Link>{" "}
            and add the WhatsApp product.
          </li>
          <li>Copy the Phone Number ID and temporary/permanent Access Token into the backend's <code>.env</code>.</li>
          <li>
            Set <code>WHATSAPP_VERIFY_TOKEN</code> to any random string, then in the Meta dashboard configure the
            webhook URL as <code>https://your-domain.com/api/whatsapp/webhook</code> with the same verify token.
          </li>
          <li>
            Subscribe the webhook to the <code>messages</code> field so incoming customer messages are delivered.
          </li>
          <li>
            Copy your App Secret into <code>WHATSAPP_APP_SECRET</code> — this is used to verify that incoming
            webhook requests genuinely come from Meta.
          </li>
          <li>Restart the backend so the new environment variables take effect.</li>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Once connected, customers can message your WhatsApp Business number and the ordering flow (browse,
          cart, checkout, confirmation, status updates) runs automatically — see <code>conversation.service.ts</code>{" "}
          in the backend.
        </Typography>
      </Paper>
    </Box>
  );
}
