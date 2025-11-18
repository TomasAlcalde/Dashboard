import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAutomatizationOutcomes } from "../../api/clients";
import { useTheme } from "@mui/material/styles";

const AutomatizationOutcomeChart = () => {
  const { data, isLoading } = useAutomatizationOutcomes();
  const theme = useTheme();
  const chartData = (data?.items ?? []).map((item) => ({
    label: item.automatization ? "Automatizado" : "Manual",
    Cerrados: item.closed,
    "No cerrados": item.open,
  }));

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 430, display: "flex", flexDirection: "column" }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Automatización vs estado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comparación de cierres según requieran automatización
        </Typography>
      </Stack>
      {isLoading ? (
        <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
      ) : chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Sin datos para mostrar.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid stroke={theme.palette.divider} strokeWidth={0.5} />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Cerrados" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
            <Bar dataKey="No cerrados" fill={theme.palette.secondary.main} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default AutomatizationOutcomeChart;
