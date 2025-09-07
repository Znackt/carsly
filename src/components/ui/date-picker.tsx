"use client"

import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  onSelect?: (date: string) => void;
}

export function DatePicker({ onSelect }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && onSelect) {
      onSelect(format(selectedDate, "MM/dd/yyyy"));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[80px] h-6 px-1 py-0 justify-start text-left font-normal text-xs"
        >
          <CalendarIcon size={10} />
          {date ? format(date, "MM/dd") : <span>Pick</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  )
}