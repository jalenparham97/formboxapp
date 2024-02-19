import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";

interface Props {
  children: React.ReactNode;
  orgId: string;
}

export function SettingsLayout({ children, orgId }: Props) {
  return (
    <MaxWidthWrapper className="py-10">
      <div>
        <PageTitle>Settings</PageTitle>
      </div>
      <div className="mt-6">
        <NavTabs className="">
          <NavTab href={`/${orgId}/settings`} label="Account" />
          <NavTab
            href={`/${orgId}/settings/subscription`}
            label="Subscription"
          />
          <NavTab href={`/${orgId}/settings/members`} label="Members" />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
