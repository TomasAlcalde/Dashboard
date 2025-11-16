import { Paper, Typography } from '@mui/material';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts';

const URGENCY = ['Baja', 'Media', 'Alta'];
const BUDGET = ['Low', 'Mid', 'Enterprise'];

const MOCK_POINTS = URGENCY.flatMap((urgency) =>
  BUDGET.map((budget) => ({
    urgency,
    budget,
    value: Math.round(Math.random() * 100),
  }))
);

export const UrgencyBudgetHeatmap = () => (
  <Paper sx={{ p: 3, borderRadius: 3, height: 340 }}>
    <Typography variant="subtitle1" fontWeight={600} mb={2}>
      Urgencia vs presupuesto
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 16, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid />
        <XAxis type="category" dataKey="urgency" />
        <YAxis type="category" dataKey="budget" />
        <ZAxis type="number" dataKey="value" range={[60, 400]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={MOCK_POINTS} fill="#3F37C9" />
      </ScatterChart>
    </ResponsiveContainer>
  </Paper>
);

export default UrgencyBudgetHeatmap;
