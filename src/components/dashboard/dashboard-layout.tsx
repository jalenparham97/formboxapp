"use client";

import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  IconBell,
  IconCreditCard,
  IconHome,
  IconLogout,
  IconMenu2,
  IconPlus,
  IconSettings,
  IconUser,
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
import { isEmpty } from "radash";
import { LimitReachedModal } from "@/components/ui/limit-reached-modal";
import { type Workspace } from "@prisma/client";
import { type InfiniteWorkspacesData } from "@/types/workspace.types";
import { useWorkspaceModalState } from "@/stores/workspace.store";
import { signOut } from "next-auth/react";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { WorkspaceCreateDialog } from "../workspaces/workspace-create-dialog";
import { OrgSwitcher } from "../orgs/org-switcher";

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
  { name: "Dashboard", href: "/dashboard", icon: IconHome },
  // { name: "Settings", href: "/settings/account", icon: IconSettings },
  // { name: "Settings", href: "/settings/account", icon: IconSettings },
  { name: "Settings", href: "/settings", icon: IconSettings },
];

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [limitReachedModal, limitReachedModalHandlers] = useDialog();
  const { setWorkspaceModalState } = useWorkspaceModalState();

  const user = useAuthUser();

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
                              <NavListItem item={item} />
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
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-2 overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4">
            <div className="ml-2.5 flex h-16 shrink-0 items-center">
              <div className="">
                <Logo />
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <div role="list" className="flex flex-1 flex-col gap-y-4">
                <div role="list" className="space-y-1.5">
                  {/* <div>
                    {orgs.isLoading && (
                      <Skeleton className="h-[40px] w-[200px] rounded-lg" />
                    )}
                    {!orgs.isLoading && orgs.data?.data && (
                      <OrgSwitcher orgs={orgs.data?.data} />
                    )}
                  </div> */}
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <NavListItem item={item} />
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
            <div
              className="h-6 w-px bg-gray-200 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
              <div className="lg:-ml-4">
                {/* {orgs.isLoading && (
                  <Skeleton className="h-[40px] w-[200px] rounded-lg" />
                )}
                {!orgs.isLoading && orgs.data?.data && (
                  <OrgSwitcher orgs={orgs.data?.data} />
                )} */}
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <IconBell className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <Avatar>
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback className="uppercase text-white">
                        {getInitials(user?.email, 1)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    <DropdownMenuLabel>
                      <p className="text-xs font-normal text-gray-400">
                        Signed in as
                      </p>
                      <p>{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <IconUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/settings/subscription">
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
  item: {
    name: string;
    href: string;
    icon: (props: TablerIconsProps) => JSX.Element;
  };
}

function NavListItem({ item }: NavListItemProps) {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  const isActive =
    segment === item.name.toLowerCase() || pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-[13px] font-medium leading-6 text-gray-900 no-underline",
        isActive ? "bg-gray-100" : "text-gray-900 hover:bg-gray-100",
      )}
    >
      <item.icon
        className={cn(
          "h-5 w-5 text-gray-500 group-hover:text-gray-900",
          isActive && "text-gray-900",
        )}
        aria-hidden="true"
      />
      {item.name}
    </Link>
  );
}