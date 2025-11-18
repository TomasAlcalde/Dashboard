import { Box, Chip } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridValueGetter,
} from "@mui/x-data-grid";

import type { ClientRecord } from "../../api/clients";
import { getLatestTranscript } from "./utils";

const formatPercentage = (value?: number | null) => {
  if (typeof value !== "number") {
    return "-";
  }
  return `${Math.round(value * 100)}%`;
};

const sellerValueGetter: GridValueGetter<ClientRecord, string> = (
  _value,
  row
) => getLatestTranscript(row)?.assigned_seller ?? "-";

const meetingValueGetter: GridValueGetter<ClientRecord, string> = (
  _value,
  row
) => {
  const dateValue = getLatestTranscript(row)?.meeting_date;
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const fitScoreGetter: GridValueGetter<ClientRecord, string> = (
  _value,
  row
) =>
  formatPercentage(getLatestTranscript(row)?.classification?.fit_score);

const closeProbabilityGetter: GridValueGetter<ClientRecord, string> = (
  _value,
  row
) =>
  formatPercentage(
    getLatestTranscript(row)?.classification?.close_probability
  );

type ClientsTableProps = {
  rows: ClientRecord[];
  loading: boolean;
  onSelect: (client: ClientRecord) => void;
};

const columns: GridColDef<ClientRecord>[] = [
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
    valueGetter: sellerValueGetter,
  },
  {
    field: "meeting_date",
    headerName: "Reunión",
    flex: 1,
    minWidth: 160,
    valueGetter: meetingValueGetter,
  },
  {
    field: "closed",
    headerName: "Estado",
    flex: 0.5,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<ClientRecord>) => {
      const latest = getLatestTranscript(params.row);
      const isClosed = latest?.closed ?? false;
      if (isClosed) {
        return (
          <Chip
            label="Cerrado"
            size="small"
            sx={{
              bgcolor: "success.light",
              color: "success.dark",
              border: "1px solid",
              borderColor: "success.dark",
              fontWeight: 600,
            }}
          />
        );
      }
      return (
        <Chip
          label="Abierto"
          size="small"
          sx={{
            bgcolor: "primary.light",
            color: "primary.dark",
            border: "1px solid",
            borderColor: "primary.main",
            fontWeight: 600,
          }}
        />
      );
    },
  },
  {
    field: "fit_score",
    headerName: "Fit Score",
    flex: 0.5,
    minWidth: 120,
    valueGetter: fitScoreGetter,
  },
  {
    field: "close_probability",
    headerName: "Prob. Cierre",
    flex: 0.7,
    minWidth: 150,
    valueGetter: closeProbabilityGetter,
  },
];

const ClientsTable = ({ rows, loading, onSelect }: ClientsTableProps) => (
  <Box sx={{ height: { xs: 450, md: 580 }, width: "100%", overflow: "hidden" }}>
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      loading={loading}
      onRowClick={(params) => onSelect(params.row)}
      sx={{
        border: "none",
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "rgba(15,23,42,0.04)",
        },
      }}
    />
  </Box>
);

export default ClientsTable;
