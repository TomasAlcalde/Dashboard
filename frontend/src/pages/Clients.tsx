import { useState } from "react";

import AddSharpIcon from "@mui/icons-material/AddSharp";
import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from "@mui/material";

import ClientsFilters, {
  FilterField,
  FilterOption,
} from "../components/clients/ClientsFilters";
import CsvIngestDialog from "../components/clients/CsvIngestDialog";
import ClientsTable from "../components/clients/ClientsTable";
import ClientDetailsDrawer from "../components/clients/ClientDetailsDrawer";
import { useClients } from "../api/clients";
import type { ClientRecord } from "../api/clients";
import { useFilterStore } from "../store/filterStore";
import type { FilterSlice } from "../store/filterStore";
import type { CSVIngestResponse } from "../api/ingest";

const dateRangeOptions: FilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
];

const ClientsPage = () => {
  const { dateRange, seller, setDateRange, setSeller } = useFilterStore();
  const { data, isLoading, refetch } = useClients({
    dateRange,
    seller,
  });
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(
    null
  );
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const rows = data?.items ?? [];
  const sellerOptions = buildSellerOptions(rows);

  const filters: FilterField[] = [
    {
      id: "dateRange",
      label: "Periodo",
      value: dateRange,
      options: dateRangeOptions,
      onChange: (value) => setDateRange(value as FilterSlice["dateRange"]),
    },
    {
      id: "seller",
      label: "Seller",
      value: seller,
      options: sellerOptions,
      onChange: (value) => setSeller(value),
    },
  ];

  const handleUploadSuccess = (response: CSVIngestResponse) => {
    setFeedback({
      severity: "success",
      message: `CSV procesado: ${response.processed_rows} filas.`,
    });
    void refetch();
  };

  const handleUploadError = (message: string) => {
    setFeedback({ severity: "error", message });
  };

  const handleFeedbackClose = () => {
    setFeedback(null);
  };

  const handleDialogOpen = () => setIsUploadDialogOpen(true);
  const handleDialogClose = () => setIsUploadDialogOpen(false);

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          boxShadow: "0 18px 40px rgba(58, 53, 65, 0.12)",
        }}
      >
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="h4" fontWeight={600}>
                Clientes
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
              flexWrap="nowrap"
              sx={{ width: "100%", maxWidth: { xs: "100%", md: "auto" }, overflowX: "auto" }}
            >
              <ClientsFilters filters={filters} />
              <Button
                variant="contained"
                onClick={handleDialogOpen}
                aria-label="Agregar clientes"
                sx={{
                  minWidth: 48,
                  width: 48,
                  height: 48,
                  p: 0,
                  borderRadius: 2,
                }}
              >
                <AddSharpIcon fontSize="small" />
              </Button>
            </Stack>
          </Stack>
          <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 3 }}>
            <ClientsTable
              rows={rows}
              loading={isLoading}
              onSelect={setSelectedClient}
            />
          </Box>
        </Stack>
      </Paper>

      <ClientDetailsDrawer
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
      <CsvIngestDialog
        open={isUploadDialogOpen}
        onClose={handleDialogClose}
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />
      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={handleFeedbackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {feedback ? (
          <Alert
            onClose={handleFeedbackClose}
            severity={feedback.severity}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
};

type FeedbackState = {
  message: string;
  severity: "success" | "error";
};

const buildSellerOptions = (clients: ClientRecord[]): FilterOption[] => {
  const sellers = new Set<string>();

  clients.forEach((client) => {
    client.transcripts?.forEach((transcript) => {
      if (transcript.assigned_seller) {
        sellers.add(transcript.assigned_seller);
      }
    });
  });

  const sorted = Array.from(sellers).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

  return [
    { value: "all", label: "Todos" },
    ...sorted.map((name) => ({ value: name, label: name })),
  ];
};

export default ClientsPage;
