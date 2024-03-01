"use client";

import { type DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { EditorSidebar } from "./editor-sidebar";
import { cn } from "@/utils/tailwind-helpers";
import { type FormField } from "@prisma/client";
import { nanoid } from "@/libs/nanoid";
import { useFormStore } from "@/stores/editor.store";
import { isEmpty } from "radash";
import { HeadingElement } from "@/components/editor/fields/heading-element";
import { TextFieldElement } from "@/components/editor/fields/text-field-element";
import { TextAreaFieldElement } from "@/components/editor/fields/textarea-field-element";
import { EditorTitleAndDescription } from "@/components/editor/editor-title-and-description";

const fieldsLabelMap = {
  heading: "Section heading",
  short_answer: "Short answer",
  long_answer: "Long answer",
  multiple_choice: "Multiple choice",
  single_choice: "Single choice",
  number: "Number",
  email: "Email",
  phone: "Phone number",
  page: "Page",
} as const;

type FormElementSubType = keyof typeof fieldsLabelMap;

function createField(subtype: FormElementSubType, pagesLength = 0) {
  const fieldId = nanoid();
  const field: FormField = {
    id: fieldId,
    label: fieldsLabelMap[subtype],
    subtype,
    type: "text",
    required: false,
    description: "",
    showDescription: false,
    options: [],
  };

  if (subtype === "multiple_choice" || subtype === "single_choice") {
    field.options = [
      { id: nanoid(), value: "Option 1" },
      { id: nanoid(), value: "Option 2" },
      { id: nanoid(), value: "Option 3" },
    ];
  }

  if (subtype === "email") {
    field.type = "email";
    field.required = true;
  }

  if (subtype === "phone") {
    field.type = "tel";
  }

  const isPage = subtype === "page";

  if (isPage) {
    field.type = "fb-page-break";
    field.label = `Page ${pagesLength === 0 ? 2 : pagesLength + 2}`;
  }

  return field;
}

export function Editor() {
  const { formState, addElement } = useFormStore();

  const droppable = useDroppable({
    id: "editor-drop-area",
    data: { isEditorDropArea: true },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isFieldElement = active.data?.current?.isFieldElement;
      const isDroppingOverEditorDropArea = over.data?.current?.isEditorDropArea;

      const droppingSidebarBtnOverEditorDropArea =
        isFieldElement && isDroppingOverEditorDropArea;

      const pagesLength = formState?.fields.filter(
        (field) => field.subtype === "page",
      ).length;

      // First scenario
      if (droppingSidebarBtnOverEditorDropArea) {
        const subtype = active.data?.current?.subType as FormElementSubType;
        const field = createField(subtype, pagesLength);

        if (formState) {
          addElement(field, formState.fields.length);
        }
      }
    },
  });

  return (
    <div className="flex h-full w-full flex-col py-10 lg:pr-[350px]">
      <div className="m-auto h-full w-full">
        <EditorTitleAndDescription />
      </div>

      <div className="m-auto h-full w-full px-4">
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "m-auto flex h-full max-w-[720px] flex-1 flex-grow flex-col items-center justify-start overflow-auto overflow-y-auto bg-background p-6",
            droppable.isOver && "bg-gray-100",
          )}
        >
          {!droppable.isOver && formState?.fields?.length === 0 && (
            <div className="flex h-[120px] w-full flex-grow items-center justify-center rounded-xl border border-dashed border-gray-300 p-6">
              <p>Drag and drop elements from right sidebar here</p>
            </div>
          )}
          {droppable.isOver && formState?.fields?.length === 0 && (
            <div className="flex h-[120px] w-full flex-grow items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-200 p-6"></div>
          )}
          {!isEmpty(formState?.fields) && (
            <div className="w-full">
              {formState?.fields?.map((field) => renderEditorField(field))}
            </div>
          )}
        </div>
      </div>

      <EditorSidebar />
    </div>
  );
}

type FieldsMapComponents = {
  heading: React.JSX.Element;
  short_answer: React.JSX.Element;
  long_answer: React.JSX.Element;
  multiple_choice: React.JSX.Element;
  single_choice: React.JSX.Element;
  number: React.JSX.Element;
  email: React.JSX.Element;
  phone: React.JSX.Element;
  page: React.JSX.Element;
};

function renderEditorField(field: FormField) {
  const fieldsMap = {
    short_answer: <TextFieldElement field={field} />,
    long_answer: <TextAreaFieldElement field={field} />,
    number: <TextFieldElement field={field} />,
    email: <TextFieldElement field={field} />,
    phone: <TextFieldElement field={field} />,
    multiple_choice: <TextFieldElement field={field} />,
    single_choice: <TextFieldElement field={field} />,
    heading: <HeadingElement field={field} />,
    page: <TextFieldElement field={field} />,
    // long_answer: <LongAnswerElement field={field} />,
    // multiple_choice: <MultipleChoiceElement field={field} />,
    // single_choice: <SingleChoiceElement field={field} />,
    // number: <NumberElement field={field} />,
    // email: <EmailElement field={field} />,
    // phone: <PhoneNumberElement field={field} />,
    // page: <PageElement field={field} />,
  } as const;

  return fieldsMap[field.subtype as keyof FieldsMapComponents];
}
