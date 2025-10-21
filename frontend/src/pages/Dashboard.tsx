import { DashboardAdmin, DashboardPadreFamilia, LoadingScreen } from '../components';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from '../layout/PageLayout';

const Dashboard = () => {

  const { user } = useAuth();

  if (!user) return <LoadingScreen message='Cargando Datos...' />;

  return (
    <PageLayout title={user.tipo_usuario ==="padre_familia" ? "Gestión de Estudiantes":'Panel de Control'}>
      {user.tipo_usuario === 'administrador' && <DashboardAdmin />}
      {user.tipo_usuario === 'administrativo' && <DashboardAdmin />}
      {user.tipo_usuario === 'padre_familia' && <DashboardPadreFamilia />}
    </PageLayout>
  );
};

export default Dashboard;
