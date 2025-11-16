import { Navigate, Route, Routes} from 'react-router-dom';

import Layout from './layout/Layout';
import ClientsPage from './pages/Clients';
import MetricsPage from './pages/Metrics';

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/metrics" replace />} />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="/clients" element={<ClientsPage />} />
    </Route>
  </Routes>
);

export default App;
