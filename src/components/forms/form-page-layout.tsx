"use client";

import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { NavTabs, NavTab } from "@/components/ui/nav-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { Badge } from "@/components/ui/badge";
import { useFormById } from "@/queries/form.queries";
import { useOrgMemberRole } from "@/queries/org.queries";
import { useAuthUser } from "@/queries/user.queries";
import { ViewAlert } from "../ui/viewer-alert";

interface Props {
  children: React.ReactNode;
  orgId: string;
  formId: string;
}

export function FormPageLayout({ children, formId, orgId }: Props) {
  const user = useAuthUser();
  const { data: userRole } = useOrgMemberRole(user?.id as string, orgId);
  const form = useFormById(formId);

  return (
    <MaxWidthWrapper className="py-10">
      {userRole?.role === "viewer" && (
        <div className="mb-6">
          <ViewAlert />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {form.isLoading && (
            <div className="flex w-full items-center justify-between">
              <Skeleton className="h-[32px] w-64 rounded-lg shadow-sm" />
            </div>
          )}
          {!form.isLoading && (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href={`/dashboard/${orgId}/forms`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconArrowLeft size={16} />
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {form?.data?.name}
                </h1>
                <div>
                  {!form?.data?.isClosed && (
                    <Badge variant="green">Active</Badge>
                  )}
                  {form?.data?.isClosed && <Badge variant="red">Closed</Badge>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div>
          <Link href={`/editor/${formId}/create`}>
            <Button leftIcon={<IconPencil size={16} />}>Edit</Button>
          </Link>
        </div> */}
      </div>

      <div className="mt-6">
        <NavTabs className="">
          {/* <NavTab
            href={`/dashboard/${orgId}/forms/${formId}`}
            label="Summary"
          /> */}
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}`}
            label="Submissions"
          />
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}/setup`}
            label="Setup"
          />
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}/integrations`}
            label="Integrations"
          />
          <NavTab
            href={`/dashboard/${orgId}/forms/${formId}/settings`}
            label="Settings"
          />
        </NavTabs>

        <div className="pt-6">{children}</div>
      </div>
    </MaxWidthWrapper>
  );
}
