"use client";

import {
  IconCreditCard,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconSparkles,
  IconSwitchHorizontal,
  IconUserCircle,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { Disclosure } from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { getInitials } from "@/utils/get-initials";
import { useAuthUser } from "@/queries/user.queries";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import { useOrgById, useOrgs } from "@/queries/org.queries";
import { Button } from "../ui/button";
import { NavButton } from "../ui/nav-button";
import { Skeleton } from "../ui/skeleton";
import { OrgSwitcher } from "../orgs/org-switcher";

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const params = useParams();
  const user = useAuthUser();

  const orgId = params.orgId as string;

  const orgs = useOrgs();
  const org = useOrgById(orgId);

  async function logout() {
    await signOut({ callbackUrl: "/auth/login" });
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure
          as="nav"
          className="sticky top-0 z-50 border-b border-gray-200 bg-white"
        >
          {({ open }) => (
            <>
              <div className="mx-auto px-4">
                <div className="flex h-16 justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-shrink-0 items-center space-x-6">
                      <Logo icon />
                      <span className="font-thin text-gray-400">/</span>
                      {orgs.isLoading && (
                        <Skeleton className="h-[35px] w-[200px] rounded-lg" />
                      )}
                      {!orgs.isLoading && orgs.data?.data && (
                        <OrgSwitcher orgs={orgs.data?.data} />
                      )}
                    </div>
                    <div className="space-x-2">
                      <NavButton href={`/dashboard/${orgId}/forms`}>
                        Forms
                      </NavButton>
                      {/* <NavButton href={`/dashboard/${orgId}/settings`}>
                        Domains
                      </NavButton>
                      <NavButton href={`/dashboard/${orgId}/settings`}>
                        Integrations
                      </NavButton> */}
                      <NavButton href={`/dashboard/${orgId}/settings`}>
                        Settings
                      </NavButton>
                    </div>
                  </div>
                  <div className="hidden space-x-4 sm:flex sm:items-center">
                    {/* <Button variant="outline">Feedback</Button> */}

                    {/* <Button
                      variant="outline"
                      size="icon"
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <IconSparkles
                        className="h-[22px] w-[22px]"
                        aria-hidden="true"
                      />
                    </Button> */}

                    {/* Profile dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center">
                        <span className="sr-only">Open user menu</span>
                        <Avatar>
                          <AvatarImage src={user?.image || ""} />
                          <AvatarFallback className="uppercase text-white">
                            {getInitials(user?.email, 1)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[250px]"
                      >
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
                        <Link
                          href={`/dashboard/${orgId}/settings/subscription`}
                        >
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
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <IconX className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <IconMenu2
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {/* {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={cn(
                        item.current
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium",
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))} */}
                </div>
                {/* <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <IconBell className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div> */}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main>{children}</main>
      </div>
    </>
  );
}
