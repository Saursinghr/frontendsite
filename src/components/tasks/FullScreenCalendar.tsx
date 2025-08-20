import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { motion } from "framer-motion";
import { addDays } from "date-fns";

import "react-day-picker/dist/style.css";

import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

// Get Monday of selected week
const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
};

const FullScreenWeekPicker = () => {
  const navigate = useNavigate();
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | undefined>(undefined);

  const handleDaySelect = (date?: Date) => {
    if (!date) return;
    const weekStart = getWeekStart(date);
    setSelectedWeekStart(weekStart);
    navigate("/tasks");
  };

  const modifiers = {
    selectedWeek: (day: Date) => {
      if (!selectedWeekStart) return false;
      const start = selectedWeekStart;
      const end = addDays(start, 6);
      return day >= start && day <= end;
    }
  };

  const mockSites = [
    { id: 1, name: "Downtown Office Complex" },
    { id: 2, name: "Riverside Apartments" },
    { id: 3, name: "Shopping Mall Development" }
  ];

  return (
    <MainLayout>
      <Header
        showSiteSelector={true}
        selectedSite="Select Site"
        sites={mockSites}
        onSelectSite={(id) => console.log(`Selected site: ${id}`)}
      />

      {/* Fullscreen Overlay */}
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl bg-white rounded-lg shadow-xl flex flex-col"
        >
          <div className="text-center pt-6 px-4">
            <h1 className="text-3xl font-bold mb-2">Select a Week</h1>
            <p className="text-gray-500 mb-6">
              Tap on any date to select a full week and view tasks
            </p>
          </div>

          <div className="flex-1 px-4 flex justify-center">
            <DayPicker
              mode="single"
              onSelect={handleDaySelect}
              modifiers={modifiers}
              modifiersClassNames={{
                selectedWeek: "bg-blue-100/70 rounded-none first:rounded-l-lg last:rounded-r-lg"
              }}
              showOutsideDays
              className="[--rdp-cell-size:3rem] [--rdp-caption-font-size:1.25rem]"
              styles={{
                root: {
                  display: 'flex',
                  flexDirection: 'column',
                },
                months: {
                  display: 'flex',
                  flexDirection: 'column'
                },
                caption_label: {
                  fontSize: 'var(--rdp-caption-font-size)',
                  fontWeight: '500'
                },
                nav: {
                  display: 'flex',
                  justifyContent: 'space-between'
                },
                table: {
                  width: '100%',
                  marginTop: '0.5rem'
                },
                head_cell: {
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#64748b'
                },
                row: {
                  height: '3.5rem'
                },
                cell: {
                  padding: '0.25rem'
                },
                day: {
                  height: 'var(--rdp-cell-size)',
                  width: '100%',
                  margin: 0,
                  fontSize: '1rem',
                  transition: 'all 0.2s ease'
                },
                day_selected: {
                  backgroundColor: 'hsl(221.2 83.2% 53.3%)',
                  color: 'white'
                },
                day_today: {
                  backgroundColor: 'hsl(210 40% 96.1%)',
                  color: 'hsl(222.2 47.4% 11.2%)'
                }
              }}
            />
          </div>

          <div className="text-center py-6 px-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default FullScreenWeekPicker;
