import { DashboardAdmin, DashboardPadreFamilia, LoadingScreen, Sidebar } from '../components';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  
  const { user } = useAuth();

  if (!user) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      {user.tipo_usuario === 'administrador' && <DashboardAdmin />}
      {user.tipo_usuario === 'administrativo' && <DashboardAdmin />}
      {user.tipo_usuario === 'padre_familia' && <DashboardPadreFamilia />}
      
    </div>
  );
};

export default Dashboard;
