import { verifySession } from "@/lib/dal";
import MerchantProfile from "@/components/MerchantProfile";

export default async function AccountPage() {
  const session = await verifySession();

  return <MerchantProfile name={session.name} role={session.role} />;
}
