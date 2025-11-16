import { useMemo, useState } from "react";

import {
  Box,
  Chip,
  Divider,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { useClients } from "../api/clients";
import type { ClientRecord, TranscriptRecord } from "../api/clients";
import { useFilterStore } from "../store/filterStore";

const sellerOptions = ["all", "Sara", "Juan", "Andrea"];
const segmentOptions = ["all", "Enterprise", "Mid Market", "SMB"];

const getLatestTranscript = (record: ClientRecord): TranscriptRecord | null => {
  const list = record.transcripts ?? [];
  if (!list.length) {
    return null;
  }
  const sorted = [...list].sort((a, b) => {
    const timeA = a.meeting_date ? new Date(a.meeting_date).getTime() : 0;
    const timeB = b.meeting_date ? new Date(b.meeting_date).getTime() : 0;
    return timeA - timeB;
  });
  return sorted[sorted.length - 1];
};

const ClientsPage = () => {
  const { dateRange, seller, segment, setDateRange, setSeller, setSegment } =
    useFilterStore();
  const { data, isLoading } = useClients({ dateRange, seller, segment });
  const [selected, setSelected] = useState<ClientRecord | null>(null);

  const rows = data?.items ?? [];

  const columns = useMemo<GridColDef<ClientRecord>[]>(
    () => [
      {
        field: "name",
        headerName: "Cliente",
        flex: 1,
        minWidth: 180,
      },

      {
        field: "assigned_seller",
        headerName: "Seller",
        flex: 1,
        minWidth: 140,
      },

      {
        field: "meeting_date",
        headerName: "Reunión",
        flex: 1,
        minWidth: 160,
      },

      {
        field: "closed",
        headerName: "Estado",
        flex: 0.5,
        minWidth: 120,
        renderCell: (data) => {
          if (data.value) {
            return <Chip label="Closed Won" color="success" />;
          }
          return <Chip label="Open" color="warning" />;
        },
      },

      {
        field: "fit_score",
        headerName: "Fit Score",
        flex: 0.5,
        minWidth: 120,
      },

      {
        field: "close_probability",
        headerName: "Prob. Cierre",
        flex: 0.7,
        minWidth: 150,
      },
    ],
    []
  );

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Clients
        </Typography>
        <Typography variant="body1" className="text-grey pb-5">
          Gestiona el pipeline y revisa la clasificacion automatica.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Periodo</InputLabel>
            <Select
              label="Periodo"
              value={dateRange}
              onChange={(event) =>
                setDateRange(event.target.value as typeof dateRange)
              }
            >
              <MenuItem value="7d">7 dias</MenuItem>
              <MenuItem value="30d">30 dias</MenuItem>
              <MenuItem value="90d">90 dias</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Seller</InputLabel>
            <Select
              label="Seller"
              value={seller}
              onChange={(event) => setSeller(event.target.value)}
            >
              {sellerOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === "all" ? "Todos" : option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Segmento</InputLabel>
            <Select
              label="Segmento"
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
            >
              {segmentOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option === "all" ? "Todos" : option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2, borderRadius: 3 }}>
        <div style={{ height: 520, width: "100%", overflow: "hidden" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            loading={isLoading}
            onRowClick={(params) => setSelected(params.row)}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(15,23,42,0.04)",
              },
            }}
          />
        </div>
      </Paper>

      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <Box sx={{ width: { xs: 320, md: 420 }, p: 3 }}>
            {(() => {
              const latestTranscript = getLatestTranscript(selected);
              return (
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={600}>
                    {selected.name}
                  </Typography>
                  {latestTranscript ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={latestTranscript.closed ? "Closed" : "Open"}
                        color={latestTranscript.closed ? "success" : "warning"}
                        size="small"
                      />
                      {latestTranscript.assigned_seller ? (
                        <Chip
                          label={latestTranscript.assigned_seller}
                          size="small"
                          variant="outlined"
                        />
                      ) : null}
                    </Stack>
                  ) : null}
                  <Divider />
                  <Typography variant="subtitle2" color="text.secondary">
                    Clasificacion
                  </Typography>
                  {latestTranscript?.classification ? (
                    <Stack spacing={1}>
                      <InfoRow
                        label="Sentiment"
                        value={latestTranscript.classification.sentiment}
                      />
                      <InfoRow
                        label="Urgency"
                        value={latestTranscript.classification.urgency}
                      />
                      <InfoRow
                        label="Use case"
                        value={latestTranscript.classification.use_case}
                      />
                      <InfoRow
                        label="Fit score"
                        value={`${
                          latestTranscript.classification.fit_score * 100
                        }%`}
                      />
                      <InfoRow
                        label="Prob. cierre"
                        value={`${
                          latestTranscript.classification.close_probability *
                          100
                        }%`}
                      />
                      {latestTranscript.classification.objections ? (
                        <InfoRow
                          label="Objeciones"
                          value={latestTranscript.classification.objections}
                        />
                      ) : null}
                      {latestTranscript.classification.competitors ? (
                        <InfoRow
                          label="Competidores"
                          value={latestTranscript.classification.competitors}
                        />
                      ) : null}
                    </Stack>
                  ) : (
                    <Typography variant="body2">
                      Sin clasificacion cargada aun.
                    </Typography>
                  )}
                  <Divider />
                  <Typography variant="subtitle2" color="text.secondary">
                    Transcript
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {latestTranscript?.transcript ?? "Sin transcript."}
                  </Typography>
                </Stack>
              );
            })()}
          </Box>
        )}
      </Drawer>
    </Stack>
  );
};

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

export default ClientsPage;
