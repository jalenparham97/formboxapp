import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/utils/tailwind-helpers";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type ActiveModifiers } from "react-day-picker";

export interface DatePickerProps {
  label?: string;
  date?: Date | null | undefined;
  onChange?: (date: Date) => void;
}

export function DatePicker({ label, date, onChange }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    date,
  );

  function selectDate(
    _day: Date | undefined,
    selectedDay: Date,
    _activeModifiers: ActiveModifiers,
    _e: React.MouseEvent,
  ) {
    // console.log("day: ", day);
    // console.log("selectedDay: ", selectedDay);
    // console.log("activeModifiers: ", activeModifiers);
    // console.log("e: ", e);
    return onChange ? onChange(selectedDay) : setSelectedDate(selectedDay);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {label}
            </label>
          )}
          <Button
            type="button"
            leftIcon={<CalendarIcon size={16} />}
            variant={"outline"}
            className={cn(
              "w-full justify-start px-2 font-normal focus-visible:ring-offset-0",
              !date && "text-muted-foreground",
              label && "mt-[4px]",
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          defaultMonth={date as Date}
          selected={(date as Date) || selectedDate}
          onSelect={selectDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
