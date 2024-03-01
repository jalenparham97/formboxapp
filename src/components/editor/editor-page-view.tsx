"use client";

import { DndContext } from "@dnd-kit/core";
import { useFormById } from "@/queries/form.queries";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Editor } from "./editor";
import { DragOverlayWrapper } from "./drag-overlay-wrapper";
import Link from "next/link";
import { useFormStore } from "@/stores/editor.store";
import { useEffect } from "react";

interface Props {
  formId: string;
}

export function EditorPageView({ formId }: Props) {
  const form = useFormById(formId);
  const { setFormState } = useFormStore();

  useEffect(() => {
    if (form.data) {
      setFormState(form.data);
    }
  }, [form.data]);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href={`/dashboard/${form.data?.orgId}/forms/${form.data?.id}`}
              >
                <Button size="icon" variant="ghost">
                  <IconArrowLeft size={16} />
                </Button>
              </Link>
              <div className="ml-3">
                {form.isLoading && (
                  <div className="flex w-full items-center justify-between">
                    <Skeleton className="h-[30px] w-64 rounded-lg shadow-sm" />
                  </div>
                )}
                {!form.isLoading && (
                  <p className="text-xl font-semibold">{form?.data?.name}</p>
                )}
              </div>
            </div>

            <div>
              <Button leftIcon={<IconDeviceFloppy size={16} />}>
                Save changes
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-full">
        <DndContext>
          <Editor />
          <DragOverlayWrapper />
        </DndContext>
      </div>
    </div>
  );
}
