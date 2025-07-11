
import { useAuthStore } from '@/stores/authStore';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import Login from './Login';

const Index = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
