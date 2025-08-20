
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { addDays, startOfWeek } from "date-fns";

interface WeeklyCalendarProps {
  onSelectWeek: (date: Date) => void;
}

const WeeklyCalendar = ({ onSelectWeek }: WeeklyCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      setSelectedDate(date);
      onSelectWeek(weekStart);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;
