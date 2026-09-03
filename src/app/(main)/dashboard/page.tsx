import { verifySession } from '@/lib/dal';
import ClientDashboard from '@/components/ClientDashboard';
import Layout from '@/components/Layout';

export const metadata = {
  title: 'Dashboard · Foodiego',
};

export default async function DashboardPage() {
  const session = await verifySession();

  return (
    <Layout
      user={{
        name: session.name,
        email: session.email,
        role: session.role,
      }}
    >
      <ClientDashboard
        name={session.name}
        role={session.role}
        email={session.email}
      />
    </Layout>
  );
}
