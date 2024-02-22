"use client";

import Link from "next/link";
import { useMemo } from "react";
import { IconFolder, IconPlus, IconUsers } from "@tabler/icons-react";
import { PageTitle } from "../ui/page-title";
import { SearchInput } from "../ui/search-input";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { OrgCreateDialog } from "./org-create-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { useInfiniteOrgs } from "@/queries/org.queries";
import { Skeleton } from "../ui/skeleton";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { type InfiniteOrgsData, type OrgsOutput } from "@/types/org.types";

const loadingWorkspaces = new Array(3).fill("");

export const formatOrgs = (orgs: InfiniteOrgsData) => {
  let data: OrgsOutput["data"] = [];
  if (orgs) {
    for (const page of orgs.pages) {
      data = [...data, ...page.data];
    }
    return data.map((org) => ({
      ...org,
      stripePlanNickname: org?.stripePlanNickname?.split("-")[0] ?? "Free",
    }));
  }
  return data;
};

export function OrgsView() {
  const [orgCreateDialog, orgCreateDialogHandler] = useDialog();
  const [searchString, setSearchString] = useDebouncedState("", 250);

  const orgs = useInfiniteOrgs({ searchString });

  const data = useMemo(() => formatOrgs(orgs.data), [orgs.data]);

  return (
    <>
      <div className="min-h-full">
        <div className="py-10">
          <header>
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
              <PageTitle>Organizations</PageTitle>
              <div>
                <Button
                  leftIcon={<IconPlus size={16} />}
                  onClick={orgCreateDialogHandler.open}
                >
                  Create organization
                </Button>
              </div>
            </div>
          </header>
          <main>
            <div className="mx-auto mt-6 max-w-7xl px-4">
              {/* Your content */}
              <div>
                <SearchInput
                  placeholder="Search organizations"
                  className="w-full"
                  defaultValue={searchString}
                  onChange={(event) =>
                    setSearchString(event.currentTarget.value)
                  }
                />
              </div>

              {orgs.isLoading && (
                <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  {loadingWorkspaces.map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-[125px] w-full rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              )}

              {!orgs.isLoading && (
                <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  {!orgs?.isLoading &&
                    data.map((org) => (
                      <Card
                        key={org.id}
                        className="border border-gray-200 p-7 shadow-sm hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/dashboard/${org.id}`}
                            className="text-dark-900"
                          >
                            <h3 className="text-xl font-semibold">
                              {org.name}
                            </h3>
                          </Link>
                          <Badge variant="gray" className="capitalize">
                            {org.stripePlanNickname}
                          </Badge>
                        </div>

                        <div className="mt-5 flex items-center space-x-3">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <IconUsers size={16} />{" "}
                            <span>{org._count.members} members</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <IconFolder size={16} /> <span>0 workspaces</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </main>

          <OrgCreateDialog
            open={orgCreateDialog}
            onClose={orgCreateDialogHandler.close}
          />
        </div>
      </div>
    </>
  );
}
