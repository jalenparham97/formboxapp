"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { PageTitle } from "@/components/ui/page-title";
import { SearchInput } from "@/components/ui/search-input";
import { useDialog } from "@/hooks/use-dialog";
import { IconFileText, IconFolder, IconUsers } from "@tabler/icons-react";
import { WorkspaceCreateDialog } from "@/components/workspaces/workspace-create-dialog";
import {
  type WorkspacesOutput,
  type InfiniteWorkspacesData,
} from "@/types/workspace.types";
import type { Workspace } from "@prisma/client";
import { useEffect, useMemo } from "react";
import { useInfiniteWorkspaces } from "@/queries/workspace.queries";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { useInView } from "react-intersection-observer";
import { Loader } from "@/components/ui/loader";
import { WorkspaceCardActionMenu } from "@/components/workspaces/workspace-card-actions-menu";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { formatWorkspaces } from "@/utils/format-workspaces";

interface Props {
  initialData: WorkspacesOutput;
}

export function WorkspacesView({ initialData }: Props) {
  const { ref, inView } = useInView();
  const [dialogState, dialogStateHandlers] = useDialog();
  const [searchString, setSearchString] = useDebouncedState("", 250);

  const workspaces = useInfiniteWorkspaces({ searchString }, initialData);

  useEffect(() => {
    if (workspaces.hasNextPage && inView) {
      workspaces.fetchNextPage();
    }
  }, [inView, workspaces]);

  const data = useMemo(
    () => formatWorkspaces(workspaces.data),
    [workspaces.data],
  );

  console.log("data: ", data);

  return (
    <>
      <MaxWidthWrapper className="py-10">
        <div className="flex items-center justify-between">
          <PageTitle>Workspaces</PageTitle>
          <div className="flex items-center space-x-3">
            <SearchInput
              placeholder="Search workspaces"
              defaultValue={searchString}
              onChange={(event) => setSearchString(event.currentTarget.value)}
            />
            <Button onClick={dialogStateHandlers.open}>Create workspace</Button>
          </div>
        </div>

        {!data?.length && (
          <div className="mt-40">
            <EmptyState
              title="No workspaces yet"
              subtitle="Get started by creating a new workspace."
              icon={<IconFolder size={40} />}
              actionButton={
                <Button onClick={dialogStateHandlers.open}>
                  Create workspace
                </Button>
              }
            />
          </div>
        )}

        {data.length && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {data?.map((workspace) => (
              <Card
                key={workspace.id}
                className="border border-gray-200 p-7 shadow-sm hover:border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/workspaces/${workspace.id}`}
                    className="text-dark-900 no-underline"
                  >
                    <h3 className="text-xl font-semibold">{workspace.name}</h3>
                  </Link>
                  <WorkspaceCardActionMenu workspace={workspace} />
                </div>

                <div className="mt-5 flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <IconFileText size={16} /> <span>0 forms</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <IconUsers size={16} /> <span>0 members</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div ref={ref} className="text-center">
          {workspaces.isFetchingNextPage && <Loader className="mt-5" />}
        </div>
      </MaxWidthWrapper>

      <WorkspaceCreateDialog />
    </>
  );
}
