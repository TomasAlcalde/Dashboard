import {
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useOriginDistribution } from "../../api/clients";

const OriginDistributionList = () => {
  const { data, isLoading } = useOriginDistribution();
  const items = data?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.total, 0);
  const topOrigin = items[0];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: 430,
      }}
    >
      <Stack spacing={1} mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Orígenes de los clientes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cómo los clientes conocen a Vambe
        </Typography>
      </Stack>
      {isLoading ? (
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 2 }} />
      ) : items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Aún no hay orígenes registrados.
        </Typography>
      ) : (
        <Stack spacing={1.5} sx={{ flex: 1, overflowY: "auto" }}>
          {items.map((item, index) => {
            const percentage = total ? Math.round((item.total / total) * 100) : 0;
            return (
              <Box
                key={item.origin}
                sx={{
                  borderRadius: 2,
                  p: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={0.5}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {index + 1}. {item.origin}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.total} clientes
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    position: "relative",
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "grey.200",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${percentage}%`,
                      borderRadius: 3,
                      bgcolor: "secondary.main",
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {percentage}% del total
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default OriginDistributionList;
