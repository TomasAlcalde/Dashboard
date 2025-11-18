import ConversionTimeline from "../components/dashboard/ConversionTimeline";
import {
  MonthlyConversionKpi,
  TotalConversionKpi,
} from "../components/dashboard/KpiCards";
import MonthlyConversionTrend from "../components/dashboard/MonthlyConversionTrend";
import ObjectionsChart from "../components/dashboard/ObjectionsChart";
import UrgencyBudgetHeatmap from "../components/dashboard/UrgencyBudgetHeatmap";
import UseCaseDistribution from "../components/dashboard/UseCaseDistribution";
import DashboardLayout from "../layout/DashboardLayout";

const MetricsPage = () => (
  <DashboardLayout>
    <TotalConversionKpi />
    <MonthlyConversionKpi />
    <UseCaseDistribution />
    <MonthlyConversionTrend />
    <ObjectionsChart />
    <UrgencyBudgetHeatmap />
    <ConversionTimeline />
  </DashboardLayout>
);

export default MetricsPage;
