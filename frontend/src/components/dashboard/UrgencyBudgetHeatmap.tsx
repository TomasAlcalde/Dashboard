import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

import { useUrgencyBudgetHeatmap } from "../../api/clients";

const URGENCY_LEVELS = [0, 1, 2, 3];
const URGENCY_LABELS: Record<number, string> = {
  0: "Exploración",
  1: "Dolor moderado",
  2: "Dolor alto",
  3: "Crítico",
};
const BUDGET_TIERS = ["Low", "Med", "High"];

const getColor = (value: number) => {
  const intensity = Math.min(1, Math.max(0, value));
  const alpha = 0.15 + intensity * 0.75;
  return `rgba(34,197,94,${alpha})`;
};

export const UrgencyBudgetHeatmap = () => {
  const { data, isLoading } = useUrgencyBudgetHeatmap();

  const cellMap = useMemo(() => {
    const map = new Map<string, { conversion: number; closed: number; total: number }>();
    data?.cells.forEach((cell) => {
      map.set(`${cell.urgency}-${cell.budget_tier.toLowerCase()}`, {
        conversion: cell.conversion,
        closed: cell.closed,
        total: cell.total,
      });
    });
    return map;
  }, [data]);

  const getCell = (urgency: number, budget: string) =>
    cellMap.get(`${urgency}-${budget.toLowerCase()}`) ?? {
      conversion: 0,
      closed: 0,
      total: 0,
    };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={1} mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          Urgencia × Presupuesto
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Cierre por celda (0–3 urgencia × Low/Med/High). Prioriza dolor alto con presupuesto alto y detecta cuadrantes fríos.
        </Typography>
      </Stack>
      {isLoading ? (
        <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "140px repeat(3, 1fr)",
            gap: 1,
          }}
        >
          <Box />
          {BUDGET_TIERS.map((budget) => (
            <Typography
              key={budget}
              variant="caption"
              align="center"
              color="text.secondary"
            >
              {budget}
            </Typography>
          ))}
          {URGENCY_LEVELS.map((level) => (
            <Box key={level} sx={{ display: "contents" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ alignSelf: "center" }}
              >
                {URGENCY_LABELS[level] ?? `Urgencia ${level}`}
              </Typography>
              {BUDGET_TIERS.map((budget) => {
                const { conversion, closed, total } = getCell(level, budget);
                const pct = Math.round(conversion * 100);
                return (
                  <Stack
                    key={`${level}-${budget}`}
                    alignItems="center"
                    justifyContent="center"
                    spacing={0.5}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: getColor(conversion),
                      minHeight: 70,
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      {pct}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {closed}/{total} cierres
                    </Typography>
                  </Stack>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default UrgencyBudgetHeatmap;
