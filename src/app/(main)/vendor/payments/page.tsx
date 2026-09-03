import Layout from '@/components/Layout';
import ClientDashboard from '@/components/ClientDashboard';

export const metadata = {
  title: 'Payments & Earnings · Foodiego',
};

export default function VendorPaymentsPage() {
  return (
    <Layout
      user={{
        name: 'abid',
        email: 'user@example.com',
        role: 'restaurant',
      }}
    >
      <ClientDashboard
        name="abid"
        role="restaurant"
      />
    </Layout>
  );
}
