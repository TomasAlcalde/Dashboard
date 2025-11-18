import {
  Box,
  Paper,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
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

  const items = [...(data?.items ?? [])];
  const chartData = items.map((item) => ({
    use_case: item.use_case,
    total: item.total,
  }));

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
        height: { xs: 420, md: 660 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={2}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Casos de uso clasificados
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={status}
          onChange={handleFilterChange}
        >
          {FILTER_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Box sx={{ flex: 1, minHeight: 0 }}>
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="use_case"
                width={140}
                tickLine={false}
              />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#14B8A6"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default UseCaseDistribution;
