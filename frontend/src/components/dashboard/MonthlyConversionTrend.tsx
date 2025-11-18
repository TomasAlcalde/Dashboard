import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useConversionMetrics } from "../../api/clients";

const formatPercent = (value: number) =>
  `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;

const formatMonthLabel = (value: string) => {
  const [year, month] = value.split("-");
  if (!year || !month) {
    return value;
  }
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("es-ES", { month: "short" }).replace(".", "") + ` ${year.slice(-2)}`;
};

const MonthlyConversionTrend = () => {
  const { data, isLoading } = useConversionMetrics();
  const theme = useTheme();

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, height: 390 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Conversión mensual
        </Typography>
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
        </Stack>
      </Paper>
    );
  }

  const monthly = [...(data?.monthly ?? [])].sort((a, b) =>
    a.month.localeCompare(b.month)
  );
  const chartData = monthly.map((entry) => ({
    label: formatMonthLabel(entry.month),
    conversion: entry.conversion ?? 0,
  }));

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 340, pb: 8 }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Conversión mensual
        </Typography>
      </Stack>
      {chartData.length === 0 ? (
        <Stack
          height={220}
          alignItems="center"
          justifyContent="center"
          color="text.secondary"
        >
          <Typography variant="body2">Sin datos para mostrar.</Typography>
        </Stack>
      ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke={theme.palette.divider} strokeWidth={0.5} />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(value) => formatPercent(value)} />
              <Tooltip formatter={(value: number) => formatPercent(value)} />
              <Line
                type="monotone"
              dataKey="conversion"
              stroke={theme.palette.secondary.main}
              strokeWidth={3}
              dot={{ strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default MonthlyConversionTrend;
