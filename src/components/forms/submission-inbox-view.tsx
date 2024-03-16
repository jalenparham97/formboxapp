"use client";

import { useDebouncedState } from "@/hooks/use-debounced-state";
import { useInfiniteSubmissions } from "@/queries/submissions.queries";
import {
  type InfiniteSubmissionsData,
  type SubmissionOutput,
} from "@/types/submission.types";
import { isEmpty } from "radash";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { IconInbox } from "@tabler/icons-react";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";
import { SubmissionCard } from "./submission-card";
import { SubmissionExportMenu } from "./submission-export-menu";

const loadingItems = new Array(5).fill("");

export const formatSubs = (submissions: InfiniteSubmissionsData) => {
  let data: SubmissionOutput[] = [];
  if (submissions) {
    for (const page of submissions.pages) {
      data = [...data, ...page.data];
    }
    return data.map((submission) => ({
      ...submission,
    }));
  }
  return data;
};

interface Props {
  formId: string;
  userRole: string | undefined;
}

export function SubmissionInboxView({ formId, userRole }: Props) {
  const { ref, inView } = useInView();
  const [searchString, setSearchString] = useDebouncedState("", 250);

  const submissions = useInfiniteSubmissions({
    formId,
    searchString,
    isSpam: false,
  });

  useEffect(() => {
    if (submissions.hasNextPage && inView) {
      submissions.fetchNextPage();
    }
  }, [inView, submissions]);

  const data = useMemo(() => formatSubs(submissions.data), [submissions.data]);

  const noSearchResults = isEmpty(data) && !isEmpty(searchString);

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center space-x-3">
          <div className="grow">
            <SearchInput
              placeholder="Search submissions"
              defaultValue={searchString}
              onChange={(e) => setSearchString(e.currentTarget.value)}
              className="w-full"
            />
          </div>
          <div className="flex-none">
            <SubmissionExportMenu formId={formId} isSpam="false" />
          </div>
        </div>
      </div>

      {submissions?.isLoading && (
        <div className="mt-6 space-y-4">
          {loadingItems.map((_, index) => (
            <Skeleton key={index} className="h-[80px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {!submissions?.isLoading && (
        <>
          <div className="mt-6">
            <div className="space-y-4">
              {data?.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  userRole={userRole}
                />
              ))}
            </div>
          </div>

          {isEmpty(data) && !noSearchResults && (
            <div className="mt-4 rounded-xl border border-gray-300 p-28">
              <EmptyState
                title="No submissions yet"
                subtitle="Setup your form in your website to start recieving submissions."
                icon={<IconInbox size={40} />}
              />
            </div>
          )}

          {noSearchResults && (
            <div className="mt-6 rounded-xl border border-gray-300 p-28">
              <EmptyState
                title="No search results"
                subtitle="Please check the spelling or filter criteria"
                icon={<IconInbox size={40} />}
              />
            </div>
          )}

          <div ref={ref} className="flex items-center justify-center">
            {submissions.isFetchingNextPage && <Loader className="mt-5" />}
          </div>
        </>
      )}
    </div>
  );
}
