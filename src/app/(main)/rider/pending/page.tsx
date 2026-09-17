// Usage — rider/pending/page.tsx
import { StatusScreen } from "@/components/ui/StatusScreen";

export default function RiderPendingPage() {
  return (
    <StatusScreen
      status="pending"
      title="Your rider application is under review"
      message="Our team is verifying your documents. This usually takes 1-2 business days."
    />
  );
}