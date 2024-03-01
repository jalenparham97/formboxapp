"use client";

import { useState } from "react";
import { type Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { EditorFieldElementOverlay } from "./editor-field-element";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import {
  IconAt,
  IconCircleCheck,
  IconHash,
  IconHeading,
  IconPageBreak,
  IconPhone,
  IconSquareCheck,
} from "@tabler/icons-react";

type FieldsLabelMap = {
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

const iconsMap = {
  short_answer: <CgDetailsLess size="20px" />,
  long_answer: <CgDetailsMore size="20px" />,
  number: <IconHash size="20px" />,
  email: <IconAt size="20px" />,
  phone: <IconPhone size="20px" />,
  single_choice: <IconCircleCheck size="20px" />,
  multiple_choice: <IconSquareCheck size="20px" />,
  heading: <IconHeading size="20px" />,
  page: <IconPageBreak size="20px" />,
};

export function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>Drag overlay</div>;
  const isFieldElement = draggedItem?.data?.current?.isFieldElement;

  if (isFieldElement) {
    const subType = draggedItem?.data?.current?.subType as string;
    const name = draggedItem?.data?.current?.name as string;
    node = (
      <EditorFieldElementOverlay
        icon={iconsMap[subType as keyof FieldsLabelMap]}
        name={name}
      />
    );
  }

  return <DragOverlay>{node}</DragOverlay>;
}
