import {
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
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
import { useState } from "react";

import {
  type UseCaseStatus,
  useUseCaseDistribution,
} from "../../api/clients";

const FILTER_OPTIONS: { label: string; value: UseCaseStatus }[] = [
  { label: "Todos", value: "all" },
  { label: "Cerrados", value: "closed" },
  { label: "Abiertos", value: "open" },
];

const UseCaseDistribution = () => {
  const [status, setStatus] = useState<UseCaseStatus>("all");
  const { data, isLoading } = useUseCaseDistribution(status);
  const theme = useTheme();

  const items = [...(data?.items ?? [])];
  const chartData = items.map((item) => ({
    use_case: item.use_case,
    total: item.total,
  }));

  const totalCases = chartData.reduce((sum, entry) => sum + entry.total, 0);

  const handleFilterChange = (_event: unknown, value: UseCaseStatus | null) => {
    if (value) {
      setStatus(value);
    }
  };

  const showEmptyState = !isLoading && chartData.length === 0;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        height: { xs: 420, md: 585 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack spacing={1} mb={2}>
        <Typography variant="h4" fontWeight={700}>
          Casos por industria
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {status === "all"
                ? "Todos los casos"
                : status === "closed"
                ? "Casos cerrados"
                : "Casos abiertos"}
            </Typography>
            <Typography variant="h3" fontWeight={700}>
              {totalCases}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de oportunidades
            </Typography>
          </Stack>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={status}
            onChange={handleFilterChange}
            color="primary"
          >
            {FILTER_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Stack sx={{ flex: 1, minHeight: 0 }}>
        {isLoading ? (
          <Skeleton
            variant="rounded"
            height="100%"
            sx={{ borderRadius: 2, minHeight: 280 }}
          />
        ) : showEmptyState ? (
          <Stack
            height="100%"
            alignItems="center"
            justifyContent="center"
            color="text.secondary"
          >
            <Typography variant="body2">Sin datos para mostrar.</Typography>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 12, right: 24, top: 8, bottom: 8 }}
            >
              <CartesianGrid stroke={theme.palette.divider} strokeWidth={0.5} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="use_case"
                width={180}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="total"
                fill={theme.palette.secondary.main}
                radius={[0, 12, 12, 0]}
                barSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Stack>
    </Paper>
  );
};

export default UseCaseDistribution;
