import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import { useConversionMetrics } from "../../api/clients";

const formatPercent = (value: number) =>
  `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;

type KpiCardProps = {
  title: ReactNode;
  metric: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  comparisonLabel?: ReactNode;
  comparisonValue?: ReactNode;
  bgColor?: string;
  textColor?: string;
};

export const KpiCard = ({
  title,
  metric,
  description,
  icon,
  comparisonLabel,
  comparisonValue,
  bgColor,
  textColor,
}: KpiCardProps) => (
  <Paper sx={{ p: 3, borderRadius: 3, height: "100%", bgcolor: bgColor }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={3}>
      <Stack spacing={1} alignItems="flex-start">
        {icon ? (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "20%",
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textColor ?? "inherit",
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Typography variant="caption" color={textColor ?? "text.secondary"}>
          {description}
        </Typography>
        <Typography variant="h3" fontWeight={700} color={textColor}>
          {metric}
        </Typography>
        <Typography variant="body1" color={textColor ?? "text.secondary"}>
          {title}
        </Typography>
      </Stack>
      {comparisonLabel || comparisonValue ? (
        <Stack spacing={0.5} alignItems="flex-end" minWidth={80}>
          {comparisonLabel ? (
            <Box
              component="span"
              sx={{ color: textColor ?? "text.secondary", fontSize: 12 }}
            >
              {comparisonLabel}
            </Box>
          ) : null}
          {comparisonValue ? (
            <Box component="span" sx={{ color: textColor, fontSize: 18, fontWeight: 600 }}>
              {comparisonValue}
            </Box>
          ) : null}
        </Stack>
      ) : null}
    </Stack>
  </Paper>
);

export const TotalConversionKpi = () => {
  const { data, isLoading } = useConversionMetrics();

  if (isLoading) {
    return (
      <KpiCard
        title="Tasa de conversión total"
        metric={<Skeleton width={80} />}
        description={<Skeleton width="70%" />}
        icon={<TrendingUpIcon fontSize="small" />}
        bgColor="primary.main"
        textColor="common.white"
      />
    );
  }

  const totals = (data?.monthly ?? []).reduce(
    (acc, entry) => {
      acc.closed += entry.closed;
      acc.total += entry.total;
      return acc;
    },
    { closed: 0, total: 0 }
  );

  const conversionValue =
    totals.total > 0 ? totals.closed / totals.total : 0;
  const totalConversion = formatPercent(conversionValue);
  const description =
    totals.total > 0
      ? `${totals.closed} cerrados / ${totals.total} total`
      : "Sin datos";

  return (
    <KpiCard
      title="Tasa de conversión total"
      metric={totalConversion}
      description={description}
      icon={<TrendingUpIcon fontSize="small" />}
      bgColor="primary.main"
      textColor="common.white"
    />
  );
};

export const MonthlyConversionKpi = () => {
  const { data, isLoading } = useConversionMetrics();

  if (isLoading) {
    return (
      <KpiCard
        title="Conversión últimos 2 meses"
        metric={<Skeleton width={80} />}
        description={<Skeleton width="60%" />}
        icon={<QueryStatsIcon fontSize="small" />}
        comparisonLabel={<Skeleton width={80} />}
        comparisonValue={<Skeleton width={60} />}
        bgColor="secondary.main"
        textColor="common.white"
      />
    );
  }

  const monthly = [...(data?.monthly ?? [])].sort((a, b) =>
    a.month.localeCompare(b.month)
  );
  const latest = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];
  const metric = latest ? formatPercent(latest.conversion) : "-";
  const description = latest
    ? `${latest.month}: ${latest.closed}/${latest.total}`
    : "Sin datos recientes";

  const difference =
    latest && previous ? latest.conversion - previous.conversion : null;
  const comparisonLabel = previous ? `Vs ${previous.month}` : undefined;
  const comparisonValue =
    difference !== null
      ? `${difference >= 0 ? "+" : ""}${(difference * 100).toFixed(1)} %`
      : previous
      ? formatPercent(previous.conversion)
      : undefined;

  return (
    <KpiCard
      title="Conversión último mes"
      metric={metric}
      description={description}
      comparisonLabel={comparisonLabel}
      comparisonValue={comparisonValue}
      icon={<QueryStatsIcon fontSize="small" />}
      bgColor="secondary.main"
      textColor="common.white"
    />
  );
};

export default KpiCard;
