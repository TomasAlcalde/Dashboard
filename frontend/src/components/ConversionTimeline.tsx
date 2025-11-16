import { Paper, Typography } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const MOCK_TIMELINE = Array.from({ length: 12 }).map((_, index) => ({
  label: `Semana ${index + 1}`,
  rate: 0.28 + Math.sin(index / 3) * 0.05 + index * 0.005,
}));

export const ConversionTimeline = () => (
  <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
    <Typography variant="subtitle1" fontWeight={600} mb={2}>
      Conversion temporal
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={MOCK_TIMELINE}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis tickFormatter={(value) => `${Math.round(value * 100)}%`} />
        <Tooltip formatter={(value: number) => `${Math.round(value * 100)}%`} />
        <Line type="monotone" dataKey="rate" stroke="#22C55E" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

export default ConversionTimeline;
