
import React from "react";
import { ChevronDown, Plus, FileDown, Printer, Bell, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface InventoryHeaderProps {
  onAddMaterial: () => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onAddMaterial }) => {
  return (
    <div className="bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="outline" className="flex items-center">
            Downtown Office Complex <ChevronDown size={16} className="ml-2" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Plus size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Sun size={20} />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your construction materials and supplies
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2" size={16} />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2" size={16} />
            Print
          </Button>
          <Button size="sm" onClick={onAddMaterial}>
            <Plus className="mr-2" size={16} />
            Add Material
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
