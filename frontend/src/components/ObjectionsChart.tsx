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

const MOCK_DATA = [
  { label: 'Presupuesto bajo', count: 32 },
  { label: 'Sin prioridad', count: 21 },
  { label: 'Integracion', count: 18 },
  { label: 'Competencia', count: 15 },
  { label: 'Soporte', count: 8 },
];

export const ObjectionsChart = () => (
  <Paper sx={{ p: 3, borderRadius: 3, height: 320 }}>
    <Typography variant="subtitle1" fontWeight={600} mb={2}>
      Objections mas frecuentes
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={MOCK_DATA}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#6750A4" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default ObjectionsChart;
