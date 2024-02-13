import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";

interface Props {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: Props) {
  return (
    <MaxWidthWrapper>
      <div>
        <PageTitle>Settings</PageTitle>
      </div>
      <div className="mt-6">
        <NavTabs className="">
          <NavTab href="/dashboard/settings" label="Profile" />
          <NavTab
            href="/dashboard/settings/subscription"
            label="Subscription"
          />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
