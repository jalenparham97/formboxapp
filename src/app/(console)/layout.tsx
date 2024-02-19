import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

interface Props {
  children: React.ReactNode;
}

export default function DashboardPageLayout({ children }: Props) {
  return (
    <DashboardLayout>
      <div>{children}</div>
    </DashboardLayout>
  );
}
