import { Grid, Paper, Stack, Typography } from '@mui/material';

const KPI_DATA = [
  { label: 'Tasa de conversion', value: '32.4%', helper: '+4.1 vs mes pasado' },
  { label: 'Sentiment promedio', value: 'Positivo', helper: '0.68 score compuesto' },
  { label: 'Prob. media de cierre', value: '54%', helper: 'Top deals > 70%' },
];

export const KpiCards = () => (
  <Grid container spacing={2}>
    {KPI_DATA.map((item) => (
      <Grid item xs={12} md={4} key={item.label}>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {item.value}
            </Typography>
            <Typography variant="caption" color="success.main">
              {item.helper}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default KpiCards;
