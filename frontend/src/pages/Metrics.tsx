import { Box, Grid, Stack, Typography } from '@mui/material';

import CompetitorsWinRate from '../components/CompetitorsWinRate';
import ConversionTimeline from '../components/ConversionTimeline';
import KpiCards from '../components/KpiCards';
import ObjectionsChart from '../components/ObjectionsChart';
import UrgencyBudgetHeatmap from '../components/UrgencyBudgetHeatmap';

const MetricsPage = () => (
  <Stack spacing={3}>
    <KpiCards />

    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ObjectionsChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <CompetitorsWinRate />
      </Grid>
      <Grid item xs={12} md={6}>
        <UrgencyBudgetHeatmap />
      </Grid>
      <Grid item xs={12} md={6}>
        <ConversionTimeline />
      </Grid>
    </Grid>
  </Stack>
);

export default MetricsPage;
