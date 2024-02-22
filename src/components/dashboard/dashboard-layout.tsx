"use client";

import { Fragment, useMemo, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import {
  IconBell,
  IconChevronDown,
  IconCreditCard,
  IconHome,
  IconLogout,
  IconMenu2,
  IconPlus,
  IconSettings,
  IconSparkles,
  IconSwitchHorizontal,
  IconUser,
  IconUserCircle,
  IconUsers,
  IconX,
  type TablerIconsProps,
} from "@tabler/icons-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/tailwind-helpers";
import { useAuthUser } from "@/queries/user.queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { Divider } from "@/components/ui/divider";
import { useInfiniteWorkspaces } from "@/queries/workspace.queries";
import { useDialog } from "@/hooks/use-dialog";
import { hasFeatureAccess } from "@/utils/has-feature-access";
import { Button } from "@/components/ui/button";
import { WorkspaceNavItem } from "@/components/workspaces/workspace-nav-item";
import { Skeleton } from "@/components/ui/skeleton";
import { isEmpty, isEqual } from "radash";
import { LimitReachedModal } from "@/components/ui/limit-reached-modal";
import { type Workspace } from "@prisma/client";
import { type InfiniteWorkspacesData } from "@/types/workspace.types";
import { useWorkspaceModalState } from "@/stores/workspace.store";
import { signOut } from "next-auth/react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import { WorkspaceCreateDialog } from "../workspaces/workspace-create-dialog";
import { OrgSwitcher } from "../orgs/org-switcher";
import { useOrgById, useOrgs } from "@/queries/org.queries";

export const formatWorkspaces = (workspaces: InfiniteWorkspacesData) => {
  let data: Workspace[] = [];
  if (workspaces) {
    for (const page of workspaces.pages) {
      data = [...data, ...page.data];
    }
    return data.map((workspace) => ({
      ...workspace,
    }));
  }
  return data;
};

const loadingWorkspaces = new Array(5).fill("");

const navigation = [
  {
    name: "Dashboard",
    href: (id: string) => `/dashboard/${id}`,
    icon: IconHome,
  },
  {
    name: "Settings",
    href: (id: string) => `/dashboard/${id}/settings`,
    icon: IconSettings,
  },
];

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const orgs = useOrgs();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limitReachedModal, limitReachedModalHandlers] = useDialog();
  const { setWorkspaceModalState } = useWorkspaceModalState();

  const orgId = params.orgId as string;

  const user = useAuthUser();

  const org = useOrgById(orgId);

  const {
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    data: workspaces,
  } = useInfiniteWorkspaces();

  const data = useMemo(() => formatWorkspaces(workspaces), [workspaces]);

  const openWorkspaceModal = () => {
    const isWorkspacesLessThanOne = Number(workspaces?.pages[0]?.total) === 0;

    return setWorkspaceModalState(true);

    // if (
    //   hasFeatureAccess(user?.stripePlan, "1 workspace") &&
    //   isWorkspacesLessThanOne
    // ) {
    //   return setWorkspaceModalState(true);
    // }

    // if (hasFeatureAccess(user?.stripePlan, "Unlimited workspaces")) {
    //   return setWorkspaceModalState(true);
    // }

    // return limitReachedModalHandlers.open();
  };

  async function logout() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <IconX
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-white px-4 pb-4">
                    <div className="ml-2 flex h-16 shrink-0 items-center">
                      <div className="">
                        <Logo />
                      </div>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <div role="list" className="flex flex-1 flex-col gap-y-7">
                        <div role="list" className="space-y-1.5">
                          {navigation.map((item) => (
                            <div key={item.name}>
                              <NavListItem item={item} orgId={orgId} />
                            </div>
                          ))}
                        </div>
                        <Divider />
                        <div className="">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Workspaces</h4>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={openWorkspaceModal}
                            >
                              <IconPlus size={16} />
                            </Button>
                          </div>

                          <div className="mt-4 w-full space-y-1.5">
                            {isLoading && (
                              <>
                                {loadingWorkspaces.map((_, index) => (
                                  <Skeleton
                                    key={index}
                                    className="h-[30px] rounded-lg"
                                  />
                                ))}
                              </>
                            )}
                            {!isLoading && (
                              <>
                                {!isEmpty(data) && (
                                  <>
                                    {data.map((workspace) => (
                                      <WorkspaceNavItem
                                        key={workspace.id}
                                        href={`/workspaces/${workspace.id}`}
                                        text={workspace.name || ""}
                                      />
                                    ))}

                                    {hasNextPage && (
                                      <>
                                        <div>
                                          {!isFetchingNextPage && (
                                            <button
                                              className="text-dark-300 hover:text-dark-900 mt-2 pl-3 text-sm font-semibold"
                                              onClick={() => fetchNextPage()}
                                            >
                                              Show more
                                            </button>
                                          )}
                                          {isFetchingNextPage && (
                                            <p
                                              className="text-dark-900 mt-2 pl-3 text-sm font-semibold"
                                              onClick={() => fetchNextPage()}
                                            >
                                              Loading more...
                                            </p>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                                {isEmpty(data) && (
                                  <>
                                    <button
                                      className="w-full"
                                      onClick={openWorkspaceModal}
                                    >
                                      <div className="flex w-full items-center rounded-md border-none py-[5px] text-left transition-colors hover:bg-gray-100">
                                        <div className="flex items-center space-x-2 pl-3">
                                          <p className="text-dark-300 mt-[5px]">
                                            <IconPlus size={18} />
                                          </p>
                                          <p className="text-dark-300">
                                            Create a new workspace
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-2 overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex items-center space-x-4">
                <Logo icon />
                {org.isLoading && (
                  <Skeleton className="h-[35px] w-[200px] rounded-lg" />
                )}
                {!org.isLoading && (
                  <h2 className="text-xl font-semibold">{org.data?.name}</h2>
                )}
              </div>
            </div>
            <nav className="-mt-2 flex flex-1 flex-col">
              <div role="list" className="flex flex-1 flex-col gap-y-4">
                <div role="list" className="space-y-1.5">
                  <div className="space-y-1.5">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <NavListItem item={item} orgId={orgId} />
                      </div>
                    ))}
                  </div>
                </div>
                <Divider />
                <div className="">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Workspaces</h4>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={openWorkspaceModal}
                    >
                      <IconPlus size={16} />
                    </Button>
                  </div>

                  <div className="mt-4 w-full space-y-1.5">
                    {isLoading && (
                      <>
                        {loadingWorkspaces.map((_, index) => (
                          <Skeleton
                            key={index}
                            className="h-[35px] rounded-lg"
                          />
                        ))}
                      </>
                    )}
                    {!isLoading && (
                      <>
                        {!isEmpty(data) && (
                          <>
                            {data.map((workspace) => (
                              <WorkspaceNavItem
                                key={workspace.id}
                                href={`/workspaces/${workspace.id}`}
                                text={workspace.name || ""}
                              />
                            ))}

                            {hasNextPage && (
                              <>
                                <div>
                                  {!isFetchingNextPage && (
                                    <button
                                      className="text-dark-300 hover:text-dark-900 mt-2 pl-3 text-sm font-semibold"
                                      onClick={() => fetchNextPage()}
                                    >
                                      Show more
                                    </button>
                                  )}
                                  {isFetchingNextPage && (
                                    <p
                                      className="text-dark-900 mt-2 pl-3 text-sm font-semibold"
                                      onClick={() => fetchNextPage()}
                                    >
                                      Loading more...
                                    </p>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        )}
                        {isEmpty(data) && (
                          <>
                            <button
                              className="w-full"
                              onClick={openWorkspaceModal}
                            >
                              <div className="flex w-full items-center rounded-lg border-none py-[8px] text-left transition-colors hover:bg-gray-100">
                                <div className="flex items-center space-x-2 px-3">
                                  <p className="text-dark-300">
                                    <IconPlus size={18} />
                                  </p>
                                  <p className="text-dark-300 text-sm">
                                    Create a new workspace
                                  </p>
                                </div>
                              </div>
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <IconMenu2 className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            {/* <div
              className="h-6 w-px bg-gray-200 lg:hidden"
              aria-hidden="true"
            /> */}

            <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-shrink-0 items-center space-x-4">
                <div className="lg:hidden">
                  {orgs.isLoading && (
                    <Skeleton className="h-[35px] w-[200px] rounded-lg" />
                  )}
                  {!orgs.isLoading && orgs.data?.data && (
                    <OrgSwitcher orgs={orgs.data?.data} className="w-[200px]" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <Button variant="outline">Feedback</Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <IconSparkles
                    className="h-[22px] w-[22px]"
                    aria-hidden="true"
                  />
                </Button>

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center lg:-mr-4">
                    <span className="sr-only">Open user menu</span>
                    <Avatar>
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback className="uppercase text-white">
                        {getInitials(user?.email, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[250px]">
                    <DropdownMenuLabel>
                      <p className="text-xs font-normal text-gray-400">
                        Signed in as
                      </p>
                      <p>{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/organizations`}>
                      <DropdownMenuItem>
                        <IconSwitchHorizontal className="mr-2 h-4 w-4" />
                        <span>Switch organization</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/settings`}>
                      <DropdownMenuItem>
                        <IconUserCircle className="mr-2 h-4 w-4" />
                        <span>Manage account</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{org?.data?.name}</DropdownMenuLabel>
                    <Link href={`/dashboard/${orgId}/settings`}>
                      <DropdownMenuItem>
                        <IconSettings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/${orgId}/settings/members`}>
                      <DropdownMenuItem>
                        <IconUsers className="mr-2 h-4 w-4" />
                        <span>Members</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href={`/dashboard/${orgId}/settings/subscription`}>
                      <DropdownMenuItem>
                        <IconCreditCard className="mr-2 h-4 w-4" />
                        <span>Subscription</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <IconLogout className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <main className="">
            <div className="">
              {/* Your content */}
              <div className="">{children}</div>
            </div>
          </main>
        </div>
      </div>

      <WorkspaceCreateDialog />

      <LimitReachedModal
        title="You have reached your workspace limit"
        description="Please upgrade your account to create more workspaces."
        // size={470}
        open={limitReachedModal}
        onClose={limitReachedModalHandlers.close}
      />
    </>
  );
}

interface NavListItemProps {
  orgId: string;
  item: {
    name: string;
    href: (id: string) => string;
    icon: (props: TablerIconsProps) => JSX.Element;
  };
}

function NavListItem({ item, orgId }: NavListItemProps) {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const pathname = usePathname();
  const isActive =
    segment === item.name.toLowerCase() ||
    pathname === item.href(orgId) ||
    (segments.length > 1 && item.href(orgId).includes(segments[1]!));

  // console.log("segments: ", segments);
  // console.log("item.href(orgId): ", item.href(orgId));
  // console.log("pathname: ", pathname);
  // console.log("segments[1]: ", segments[1]);
  // console.log("isTrue: ", item.href(orgId).includes(segments[1]!));

  return (
    <Link
      href={item.href(orgId)}
      className={cn(
        "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-[13px] font-medium leading-6 text-gray-900 no-underline",
        isActive ? "bg-gray-100" : "text-gray-900 hover:bg-gray-100",
      )}
    >
      <item.icon
        className={cn(
          "h-[18px] w-[18px] text-gray-500 group-hover:text-gray-900",
          isActive && "text-gray-900",
        )}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );
}
