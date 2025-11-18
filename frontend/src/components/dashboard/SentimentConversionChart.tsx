import { Paper, Skeleton, Typography } from "@mui/material";
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

import { useSentimentConversion } from "../../api/clients";

const sentimentLabels: Record<number, string> = {
  "-2": "Muy negativo",
  "-1": "Negativo",
  0: "Neutral",
  1: "Positivo",
  2: "Muy positivo",
};

const formatLabel = (value: number) =>
  sentimentLabels[value] ?? `Sentiment ${value}`;

const SentimentConversionChart = () => {
  const { data, isLoading } = useSentimentConversion();

  const chartData = (data?.items ?? []).map((item) => ({
    sentiment: formatLabel(item.sentiment),
    Cerrados: item.closed,
    Abiertos: item.open,
  }));

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Sentiment vs estado de cierre
      </Typography>
      {isLoading ? (
        <Skeleton variant="rounded" height={220} sx={{ borderRadius: 2 }} />
      ) : chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Sin datos suficientes para mostrar.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sentiment" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Cerrados" fill="#22C55E" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Abiertos" fill="#F97316" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default SentimentConversionChart;
