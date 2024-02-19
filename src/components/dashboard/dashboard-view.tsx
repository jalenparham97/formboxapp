"use client";

import { useDialog } from "@/hooks/use-dialog";
import { useInfiniteWorkspaces } from "@/queries/workspace.queries";
import { useWorkspaceModalState } from "@/stores/workspace.store";
import {
  IconFileDescription,
  IconFolder,
  IconPlus,
  IconUsers,
} from "@tabler/icons-react";
import { isEmpty } from "radash";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { WorkspaceCardActionMenu } from "../workspaces/workspace-card-actions-menu";
import Link from "next/link";
import { Card } from "../ui/card";
import { Loader } from "../ui/loader";
import { EmptyState } from "../ui/empty-state";
import { PageTitle } from "../ui/page-title";
import { SearchInput } from "../ui/search-input";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { WorkspaceDashboardInviteDialog } from "../workspaces/workspace-dashboard-invite-dialog";
import { formatWorkspaces } from "@/utils/format-workspaces";
import { type WorkspacesOutput } from "@/types/workspace.types";
import { Button } from "../ui/button";
import { OrgInviteAcceptModal } from "../orgs/org-invite-accept-dialog";
import { useOrgById } from "@/queries/org.queries";

interface Props {
  initialData?: WorkspacesOutput;
  orgId: string;
}

export function DashboardView({ initialData, orgId }: Props) {
  const { ref, inView } = useInView();
  const { setWorkspaceModalState } = useWorkspaceModalState();
  const [searchString, setSearchString] = useDebouncedState("", 250);
  const [formCreateModal, formCreateModalHandler] = useDialog();
  const [inviteModal, inviteModalHandler] = useDialog();
  const [limitReachedModal, limitReachedModalHandlers] = useDialog();
  const [acceptModal, acceptModalHandler] = useDialog();
  const { data: org, isLoading, error } = useOrgById(orgId);

  useEffect(() => {
    if (error?.data?.code === "CONFLICT") {
      acceptModalHandler.open();
    }
  }, [acceptModalHandler, error]);

  // const workspaces = useInfiniteWorkspaces({ searchString }, initialData);

  // useEffect(() => {
  //   if (workspaces.hasNextPage && inView) {
  //     workspaces.fetchNextPage();
  //   }
  // }, [inView, workspaces]);

  // const data = useMemo(
  //   () => formatWorkspaces(workspaces.data),
  //   [workspaces.data],
  // );

  // const openWorspaceCreateModal = () => {
  //   const isWorkspacesLessThanOne =
  //     Number(workspaces?.data?.pages[0]?.total) === 0;

  //   return setWorkspaceModalState(true);

  //   if (
  //     hasFeatureAccess(user?.stripePlan, "1 workspace") &&
  //     isWorkspacesLessThanOne
  //   ) {
  //     return setWorkspaceModalState(true);
  //   }

  //   if (hasFeatureAccess(user?.stripePlan, "Unlimited workspaces")) {
  //     return setWorkspaceModalState(true);
  //   }

  //   return limitReachedModalHandlers.open();
  // };

  // const noSearchResults = isEmpty(data) && !isEmpty(searchString);

  return (
    <MaxWidthWrapper className="py-6">
      <div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            className="focus-visible:ring-dark-900 relative flex cursor-pointer items-center space-x-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-offset-2"
            // onClick={openWorspaceCreateModal}
          >
            <div className="flex w-full min-w-0 flex-col items-center space-y-1">
              <IconFolder />
              <p className="text-sm font-semibold">Create a new workspace</p>
            </div>
          </button>
          <button
            // disabled={isEmpty(data)}
            className="focus-visible:ring-dark-900 relative flex cursor-pointer items-center space-x-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-50 disabled:hover:border-gray-300"
            onClick={formCreateModalHandler.open}
          >
            <div className="flex w-full min-w-0 flex-col items-center space-y-1">
              <IconFileDescription />
              <p className="text-sm font-semibold">Create a new form</p>
            </div>
          </button>
          <button
            // disabled={isEmpty(data)}
            className="focus-visible:ring-dark-900 relative flex cursor-pointer items-center space-x-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:border-gray-300 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-50 disabled:hover:border-gray-300"
            onClick={inviteModalHandler.open}
          >
            <div className="flex w-full min-w-0 flex-col items-center space-y-1">
              <IconUsers />
              <p className="text-sm font-semibold">Invite a team member</p>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-10">
        <PageTitle>Workspaces</PageTitle>
        <div className="mt-6 flex items-center space-x-3">
          <SearchInput
            placeholder="Search workspaces"
            defaultValue={searchString}
            onChange={(event) => setSearchString(event.currentTarget.value)}
          />
        </div>
      </div>

      {/* {!isEmpty(data) && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <IconFileDescription size={16} /> <span>0 forms</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <IconUsers size={16} />{" "}
                    <span>
                      {workspace._count.members} member
                      {workspace._count.members > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )} */}

      {/* {isEmpty(data) && !noSearchResults && (
        <div className="mt-20">
          <EmptyState
            title="No workspaces yet"
            subtitle="Get started by creating a new workspace."
            icon={<IconFolder size={40} />}
            actionButton={
              <Button
                leftIcon={<IconPlus size={16} />}
                onClick={openWorspaceCreateModal}
              >
                Create workspace
              </Button>
            }
          />
        </div>
      )} */}

      {/* {noSearchResults && (
        <div className="mt-24">
          <EmptyState
            title="No search results"
            subtitle="Please check the spelling or filter criteria"
            icon={<IconFolder size={40} />}
          />
        </div>
      )} */}

      {/* <div ref={ref} className="text-center">
        {workspaces.isFetchingNextPage && <Loader className="mt-5" />}
      </div> */}

      <WorkspaceDashboardInviteDialog
        open={inviteModal}
        onClose={inviteModalHandler.close}
      />

      <OrgInviteAcceptModal
        open={acceptModal}
        onClose={acceptModalHandler.close}
        orgName={error?.message}
        orgId={orgId}
      />
    </MaxWidthWrapper>
  );
}
