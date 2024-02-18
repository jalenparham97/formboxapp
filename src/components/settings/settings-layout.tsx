import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";

interface Props {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: Props) {
  return (
    <MaxWidthWrapper className="py-10">
      <div>
        <PageTitle>Settings</PageTitle>
      </div>
      <div className="mt-6">
        <NavTabs className="">
          <NavTab href="/settings" label="Account" />
          <NavTab href="/settings/subscription" label="Subscription" />
          <NavTab href="/settings/members" label="Members" />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
