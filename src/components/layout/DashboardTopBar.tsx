
import React from "react";
import { ChevronDown, Plus, Bell, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardTopBar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-white h-16 flex items-center justify-between px-8 border-b shadow-sm lg:ml-[250px]">
      {/* Location/Project Selector */}
      <div className="flex items-center gap-5">
        <Button variant="outline" className="flex items-center font-medium px-4 py-2 h-10 rounded-md text-gray-900 border-gray-200 shadow-none bg-white hover:bg-gray-100">
          Downtown Office Complex
          <ChevronDown size={18} className="ml-2 text-gray-500" />
        </Button>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Plus size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Sun size={20} />
        </Button>
        <div className="rounded-full bg-blue-100 w-9 h-9 overflow-hidden flex items-center justify-center ml-1">
          <img
            src="https://github.com/shadcn.png"
            alt="Avatar"
            className="w-8 h-8 object-cover rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
