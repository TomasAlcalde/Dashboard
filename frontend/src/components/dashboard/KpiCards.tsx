import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import { useConversionMetrics } from "../../api/clients";

const formatPercent = (value: number) =>
  `${(value * 100).toFixed(1).replace(/\.0$/, "")}%`;

type KpiCardProps = {
  title: ReactNode;
  metric: ReactNode;
  description: ReactNode;
  extra?: ReactNode;
  bgColor?: string;
  textColor?: string;
};

export const KpiCard = ({
  title,
  metric,
  description,
  extra,
  bgColor,
  textColor,
}: KpiCardProps) => (
  <Paper sx={{ p: 3, borderRadius: 3, height: "100%", bgcolor: bgColor }}>
    <Stack spacing={1}>
      <Typography variant="body2" color={textColor ?? "text.secondary"}>
        {title}
      </Typography>
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography variant="h4" fontWeight={700} color={textColor}>
          {metric}
        </Typography>
        {extra ? (
          <Typography variant="body2" color={textColor ?? "text.secondary"}>
            {extra}
          </Typography>
        ) : null}
      </Stack>
      <Typography variant="caption" color={textColor ?? "text.secondary"}>
        {description}
      </Typography>
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
        extra={<Skeleton width={60} />}
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
  const extra =
    difference !== null
      ? `${difference >= 0 ? "+" : ""}${(difference * 100).toFixed(1)} pts`
      : previous
      ? `${previous.month}: ${formatPercent(previous.conversion)}`
      : undefined;

  return (
    <KpiCard
      title="Conversión últimos 2 meses"
      metric={metric}
      description={
        previous
          ? `${description} · Prev: ${previous.month} ${previous.closed}/${previous.total}`
          : description
      }
      extra={extra}
      bgColor="secondary.main"
      textColor="common.white"
    />
  );
};

export default KpiCard;
