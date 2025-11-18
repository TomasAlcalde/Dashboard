import {
  MonthlyConversionKpi,
  TotalConversionKpi,
} from "../components/dashboard/KpiCards";
import AutomatizationOutcomeChart from "../components/dashboard/AutomatizationOutcomeChart";
import MonthlyConversionTrend from "../components/dashboard/MonthlyConversionTrend";
import OriginDistributionList from "../components/dashboard/OriginDistributionList";
import SellerConversionList from "../components/dashboard/SellerConversionList";
import UseCaseDistribution from "../components/dashboard/UseCaseDistribution";
import DashboardLayout from "../layout/DashboardLayout";
import PainDistribution from "../components/dashboard/PainDistribution";

const MetricsPage = () => (
  <DashboardLayout>
    <TotalConversionKpi />
    <MonthlyConversionKpi />
    <UseCaseDistribution />
    <MonthlyConversionTrend />
    <PainDistribution />
    <SellerConversionList />
    <AutomatizationOutcomeChart />
    <OriginDistributionList />
  </DashboardLayout>
);

export default MetricsPage;
