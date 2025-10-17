import { DashboardAdmin, DashboardPadreFamilia, LoadingScreen } from '../components';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from '../layout/PageLayout';

const Dashboard = () => {

  const { user } = useAuth();

  if (!user) return <LoadingScreen />;

  return (
    <PageLayout>
      {user.tipo_usuario === 'administrador' && <DashboardAdmin />}
      {user.tipo_usuario === 'administrativo' && <DashboardAdmin />}
      {user.tipo_usuario === 'padre_familia' && <DashboardPadreFamilia />}
    </PageLayout>
  );
};

export default Dashboard;
