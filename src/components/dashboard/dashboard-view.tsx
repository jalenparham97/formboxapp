"use client";

import { useDialog } from "@/hooks/use-dialog";
import {
  IconClipboardText,
  IconFileDescription,
  IconInbox,
  IconPlus,
} from "@tabler/icons-react";
import { isEmpty } from "radash";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import Link from "next/link";
import { Card } from "../ui/card";
import { Loader } from "../ui/loader";
import { EmptyState } from "../ui/empty-state";
import { PageTitle } from "../ui/page-title";
import { SearchInput } from "../ui/search-input";
import { useDebouncedState } from "@/hooks/use-debounced-state";
import { Button } from "../ui/button";
import { OrgInviteAcceptModal } from "../orgs/org-invite-accept-dialog";
import { useOrgById } from "@/queries/org.queries";
import { Badge } from "../ui/badge";
import { FormCreateDialog } from "../forms/form-create-dialog";
import { useInfiniteForms } from "@/queries/form.queries";
import { type FormOutput, type InfiniteFormsData } from "@/types/form.types";
import { Skeleton } from "../ui/skeleton";
import { FormCardActionsMenu } from "../forms/form-card-actions-menu";

const loadingItems = new Array(5).fill("");

export const formatForms = (forms: InfiniteFormsData) => {
  let data: FormOutput[] = [];
  if (forms) {
    for (const page of forms.pages) {
      data = [...data, ...page.data];
    }
    return data.map((form) => ({
      ...form,
    }));
  }
  return data;
};

interface Props {
  orgId: string;
}

export function DashboardView({ orgId }: Props) {
  const { ref, inView } = useInView();
  const [searchString, setSearchString] = useDebouncedState("", 250);
  const [formCreateDialog, formCreateDialogHandler] = useDialog();
  const [limitReachedModal, limitReachedModalHandlers] = useDialog();
  const [acceptModal, acceptModalHandler] = useDialog();
  const org = useOrgById(orgId);

  useEffect(() => {
    if (org?.error?.data?.code === "CONFLICT") {
      acceptModalHandler.open();
    }
  }, [acceptModalHandler, org?.error]);

  const forms = useInfiniteForms({ orgId, searchString });

  useEffect(() => {
    if (forms.hasNextPage && inView) {
      forms.fetchNextPage();
    }
  }, [inView, forms]);

  const data = useMemo(() => formatForms(forms.data), [forms.data]);

  const noSearchResults = isEmpty(data) && !isEmpty(searchString);

  return (
    <MaxWidthWrapper className="py-10">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <PageTitle>Forms</PageTitle>
          <div>
            <Button
              leftIcon={<IconPlus size={16} />}
              onClick={formCreateDialogHandler.open}
            >
              Create form
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <SearchInput
            placeholder="Search forms"
            defaultValue={searchString}
            onChange={(event) => setSearchString(event.currentTarget.value)}
            className="w-full"
          />
        </div>
      </div>

      {forms?.isLoading && (
        <div className="mt-4 space-y-4">
          {loadingItems.map((_, index) => (
            <Skeleton key={index} className="h-[78px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!forms.isLoading && (
        <>
          <div className="mt-4 space-y-4">
            {!isEmpty(data) && (
              <>
                {data?.map((form) => (
                  <div key={form?.id}>
                    <Card className="border border-gray-200 p-5 shadow-sm hover:border-gray-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link href={`/dashboard/${orgId}/forms/${form?.id}`}>
                            <p className="text-lg font-medium">{form?.name}</p>
                          </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <IconInbox size={18} />{" "}
                              <span>{form?._count?.submissions}</span>
                            </div>
                            {!form?.isClosed && (
                              <Badge variant="green">Active</Badge>
                            )}
                            {form?.isClosed && (
                              <Badge variant="red">Closed</Badge>
                            )}
                          </div>
                          <FormCardActionsMenu form={form as FormOutput} />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </>
            )}
          </div>

          {isEmpty(data) && !noSearchResults && (
            <div className="mt-4 rounded-xl border border-gray-300 p-28">
              <EmptyState
                title="No forms yet"
                subtitle="Get started by creating a new form."
                icon={<IconFileDescription size={40} />}
                actionButton={
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    onClick={formCreateDialogHandler.open}
                  >
                    Create form
                  </Button>
                }
              />
            </div>
          )}
        </>
      )}

      {!forms?.isLoading && noSearchResults && (
        <div className="mt-4 rounded-xl border border-gray-300 p-28">
          <EmptyState
            title="No search results"
            subtitle="Please check the spelling or filter criteria"
            icon={<IconClipboardText size={40} />}
          />
        </div>
      )}

      <div ref={ref} className="text-center">
        {forms.isFetchingNextPage && <Loader className="mt-5" />}
      </div>

      <FormCreateDialog
        open={formCreateDialog}
        onClose={formCreateDialogHandler.close}
        orgId={orgId}
      />

      <OrgInviteAcceptModal
        open={acceptModal}
        onClose={acceptModalHandler.close}
        orgName={org?.error?.message}
        orgId={orgId}
      />
    </MaxWidthWrapper>
  );
}
