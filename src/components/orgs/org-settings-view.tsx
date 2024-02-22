"use client";

import { useEffect, useState } from "react";
import { useOrgById, useOrgUpdateMutation } from "@/queries/org.queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  orgId: string;
}

export function OrgSettingsView({ orgId }: Props) {
  const org = useOrgById(orgId);
  const [orgName, setOrgName] = useState<string | null | undefined>("");

  useEffect(() => {
    setOrgName(org?.data?.name);
  }, [org.data]);

  const orgUpdateMutation = useOrgUpdateMutation(orgId);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!orgName) return;
    try {
      const name = orgName || (org?.data?.name as string);
      return await orgUpdateMutation.mutateAsync({ id: orgId, name });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="space-y-6 lg:space-y-10">
        <Card>
          <form onSubmit={onSubmit}>
            <div className="p-6">
              <div>
                <h2 className="text-lg font-semibold">Organization name</h2>
                <p className="mt-2 text-gray-600">
                  This is the name of your organization on Formbox.
                </p>
              </div>
              <div className="mt-5">
                {org.isLoading && (
                  <Skeleton className="h-[36px] w-[420px] rounded-lg" />
                )}
                {!org.isLoading && (
                  <Input
                    className="w-[420px]"
                    defaultValue={orgName || ""}
                    onChange={(e) => setOrgName(e.currentTarget.value)}
                  />
                )}
              </div>
            </div>
            <Divider />
            <div className="p-6">
              <Button
                type="submit"
                loading={orgUpdateMutation.isLoading}
                disabled={orgName === "" || orgName === org?.data?.name}
              >
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="p-6">
            <div>
              <h2 className="text-lg font-semibold">Delete organization</h2>
              <p className="mt-4 max-w-[600px] text-gray-600">
                Permanently delete your organization, workspaces, and all
                associated forms plus thier submissions. This action cannot be
                undone - please proceed with caution.
              </p>
            </div>
          </div>
          <Divider />
          <div className="p-6">
            <Button variant="destructive">Delete organization</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
