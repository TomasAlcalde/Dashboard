import type { ReactNode } from "react";

import {
  Box,
  Chip,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import type { ClientRecord } from "../../api/clients";
import { getLatestTranscript } from "./utils";

type ClientDetailsDrawerProps = {
  client: ClientRecord | null;
  onClose: () => void;
};

const ClientDetailsDrawer = ({
  client,
  onClose,
}: ClientDetailsDrawerProps) => {
  const theme = useTheme();
  const latestTranscript = client ? getLatestTranscript(client) : null;
  const classification = latestTranscript?.classification;

  const formatPercent = (value?: number | null) => {
    if (typeof value !== "number") {
      return "-";
    }
    return `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(client)}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: 360, md: 460 },
          bgcolor: theme.palette.common.white,
        },
      }}
    >
      {client ? (
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={700}>
              {client.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={latestTranscript?.closed ? "Cerrado" : "Abierto"}
                color={latestTranscript?.closed ? "success" : "warning"}
                size="small"
              />
              {latestTranscript?.assigned_seller ? (
                <Chip
                  label={latestTranscript.assigned_seller}
                  size="small"
                  variant="outlined"
                />
              ) : null}
            </Stack>
          </Stack>

          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Clasificación
            </Typography>
            {classification ? (
              <Stack spacing={1.5} px={1} py={2} borderRadius={2} bgcolor="background.paper">
                <InfoRow label="Sentiment" value={String(classification.sentiment)} />
                <InfoRow label="Urgencia" value={String(classification.urgency)} />
                <InfoRow
                  label="Use case"
                  value={classification.use_case ?? "Sin definir"}
                />
                <InfoRow label="Origen" value={classification.origin} />
                <InfoRow
                  label="Automatización"
                  value={classification.automatization ? "Sí" : "No"}
                />
                <InfoRow
                  label="Fit score"
                  value={formatPercent(classification.fit_score)}
                />
                <InfoRow
                  label="Prob. cierre"
                  value={formatPercent(classification.close_probability)}
                />
                {classification.risks?.length ? (
                  <InfoRow label="Riesgos" value={classification.risks.join(" · ")} />
                ) : null}
                {classification.pains?.length ? (
                  <InfoRow label="Dolores" value={classification.pains.join(" · ")} />
                ) : null}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Sin clasificación registrada.
              </Typography>
            )}
          </Box>

          <Divider flexItem />

          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Transcript
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {latestTranscript?.transcript ?? "Sin transcript cargado."}
            </Typography>
          </Box>
        </Stack>
      ) : null}
    </Drawer>
  );
};

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

const DetailSection = ({ title, children }: DetailSectionProps) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    {children}
  </Stack>
);

type InfoRowProps = {
  label: string;
  value: string;
};

const InfoRow = ({ label, value }: InfoRowProps) => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
);

export default ClientDetailsDrawer;
