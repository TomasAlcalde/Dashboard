import { Paper, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const MOCK_SERIES = [
  { competitor: 'Acme CRM', winRate: 0.42 },
  { competitor: 'OmniStack', winRate: 0.55 },
  { competitor: 'LegacySuite', winRate: 0.35 },
  { competitor: 'Otros', winRate: 0.48 },
];

export const CompetitorsWinRate = () => (
  <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
    <Typography variant="subtitle1" fontWeight={600} mb={2}>
      Win-rate vs competidores
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={MOCK_SERIES}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="competitor" />
        <YAxis tickFormatter={(value) => `${Math.round(value * 100)}%`} />
        <Tooltip formatter={(value: number) => `${Math.round(value * 100)}%`} />
        <Bar dataKey="winRate" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default CompetitorsWinRate;
