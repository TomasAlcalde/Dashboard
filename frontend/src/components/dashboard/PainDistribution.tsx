import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { usePainDistribution } from "../../api/clients";

const PainDistribution = () => {
  const { data, isLoading } = usePainDistribution();
  const theme = useTheme();

  const chartData = (data?.items ?? []).map((item) => ({
    label: item.pain,
    total: item.total,
  }));

  const showEmptyState = !isLoading && chartData.length === 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 470, display: "flex", flexDirection: "column" }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Razones de contacto
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Principales dolores detectados
        </Typography>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {isLoading ? (
          <Skeleton variant="rounded" sx={{ borderRadius: 2, height: "100%" }} />
        ) : showEmptyState ? (
          <Stack height="100%" alignItems="center" justifyContent="center" color="text.secondary">
            <Typography variant="body2">Sin dolores registrados.</Typography>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 16, bottom: 8, left: 12 }}
            >
              <CartesianGrid stroke={theme.palette.divider} strokeWidth={0.5} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="label" width={160} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar
                dataKey="total"
                fill={theme.palette.secondary.main}
                radius={[0, 12, 12, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default PainDistribution;
