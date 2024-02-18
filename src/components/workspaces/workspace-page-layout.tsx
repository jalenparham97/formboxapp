"use client";

import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useWorkspaceById } from "@/queries/workspace.queries";
import { PageTitle } from "@/components/ui/page-title";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  children: React.ReactNode;
  workspaceId: string;
}

export function WorkspacePageLayout({ children, workspaceId }: Props) {
  const workspace = useWorkspaceById(workspaceId);

  return (
    <MaxWidthWrapper className="py-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <IconArrowLeft size={16} />
              </Button>
            </Link>
          </div>
          {!workspace?.isLoading && (
            <PageTitle>{workspace?.data?.name}</PageTitle>
          )}
          {workspace.isLoading && (
            <Skeleton className="h-[35px] w-64 rounded-lg shadow-sm" />
          )}
        </div>
        <div>
          <Button
            leftIcon={<IconPlus size={16} />}
            // onClick={openCreateFormModal}
          >
            Create form
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <NavTabs className="">
          <NavTab href={`/workspaces/${workspaceId}`} label="Forms" />
          <NavTab href={`/workspaces/${workspaceId}/members`} label="Members" />
          <NavTab
            href={`/workspaces/${workspaceId}/settings`}
            label="Settings"
          />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
