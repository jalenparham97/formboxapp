"use client";

import {
  IconAt,
  IconCircleCheck,
  IconHash,
  IconHeading,
  IconPageBreak,
  IconPhone,
  IconSquareCheck,
} from "@tabler/icons-react";
import { CgDetailsLess, CgDetailsMore } from "react-icons/cg";
import { EditorFieldElement } from "./editor-field-element";

export function EditorSidebar() {
  return (
    <aside className="right-0 min-h-screen lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-[350px] lg:flex-col">
      <div className="flex grow flex-col gap-y-4 overflow-y-auto border-l border-gray-200 bg-white pt-[70px]">
        <div></div>
        <div className="space-y-3 px-4">
          <EditorFieldElement
            icon={<CgDetailsLess size="20px" />}
            name="Short answer"
            subType="short_answer"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<CgDetailsMore size="20px" />}
            name="Long answer"
            subType="long_answer"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconHash size="20px" />}
            name="Number"
            subType="number"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconAt size="20px" />}
            name="Email address"
            subType="email"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconPhone size="20px" />}
            name="Phone number"
            subType="phone"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconCircleCheck size="20px" />}
            name="Single choice"
            subType="single_choice"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconSquareCheck size="20px" />}
            name="Multiple choice"
            subType="multiple_choice"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconHeading size="20px" />}
            name="Heading"
            subType="heading"
            onClick={() => console.log("element clicked")}
          />
          <EditorFieldElement
            icon={<IconPageBreak size="20px" />}
            name="Page"
            subType="page"
            onClick={() => console.log("element clicked")}
          />
        </div>
      </div>
    </aside>
  );
}
