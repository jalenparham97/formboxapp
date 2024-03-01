"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "../ui/card";
import { cn } from "@/utils/tailwind-helpers";

interface FieldElementProps {
  icon?: React.ReactNode;
  name?: string;
  subType?: string;
  onClick?: () => void;
}

export function EditorFieldElement({
  icon,
  name,
  onClick,
  subType,
}: FieldElementProps) {
  const draggable = useDraggable({
    id: `field-element-${subType}`,
    data: { subType, name, isFieldElement: true },
  });
  return (
    <Card
      ref={draggable.setNodeRef}
      onClick={onClick}
      className={cn(
        `flex cursor-grab items-center space-x-5 border-gray-300 px-4 py-3 transition-colors hover:border-gray-900`,
        draggable.isDragging && "h-[46px] bg-gray-100",
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      {!draggable.isDragging && (
        <>
          <span className="">{icon}</span>
          <p className="text-sm font-medium">{name}</p>
        </>
      )}
    </Card>
  );
}

export function EditorFieldElementOverlay({ icon, name }: FieldElementProps) {
  return (
    <Card
      className={`flex cursor-grab items-center space-x-5 border-gray-300 px-4 py-3 transition-colors`}
    >
      <span className="">{icon}</span>
      <p className="text-sm font-medium">{name}</p>
    </Card>
  );
}
