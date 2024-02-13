"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  IconBell,
  IconCurrencyDollar,
  IconHome,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconUser,
  IconX,
  type TablerIconsProps,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/tailwind-helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/get-initials";
import { signOut } from "next-auth/react";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import { useAuthUser } from "@/queries/user.queries";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: IconHome },
  { name: "Settings", href: "/dashboard/settings", icon: IconSettings },
];

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const user = useAuthUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                        {/* <Logo /> */}
                        <h2 className="text-lg font-medium">SaaS Template</h2>
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
          <div className="flex grow flex-col gap-y-4 overflow-y-auto border-r border-gray-200 bg-white px-4 pb-4">
            <div className="ml-2 flex h-16 shrink-0 items-center">
              <div className="flex items-center">
                {/* <Logo className="w-20" /> */}
                <h2 className="text-lg font-medium">SaaS Template</h2>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <div role="list" className="flex flex-1 flex-col gap-y-4">
                <div role="list" className="space-y-1.5">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <NavListItem item={item} />
                    </div>
                  ))}
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
              <div></div>
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
                        {getInitials(user?.name, 1) ||
                          getInitials(user?.email, 1)}
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
                    <Link href="/dashboard/settings">
                      <DropdownMenuItem>
                        <IconUser className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/settings/subscription">
                      <DropdownMenuItem>
                        <IconCurrencyDollar className="mr-2 h-4 w-4" />
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
              <div className="mx-auto">{children}</div>
            </div>
          </main>
        </div>
      </div>
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
        "group flex w-full items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium leading-6 text-gray-900 no-underline",
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
