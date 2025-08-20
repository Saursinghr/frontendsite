import React, { useState, useEffect } from "react";
import { Package, Filter, FileDown, Printer, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Material } from "@/types/material";
import { useMaterials } from "@/hooks/use-materials";
import "./PrintStyles.css";
import MaterialsTable from './MaterialsTable';

interface MaterialsViewProps {
  onAddMaterial: () => void;
  selectedSiteId?: string;
}

const MaterialsView: React.FC<MaterialsViewProps> = ({ onAddMaterial, selectedSiteId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: materials = [], isLoading, refetch } = useMaterials(
    selectedSiteId ? { projectId: selectedSiteId } : undefined
  );
  
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [printDate, setPrintDate] = useState("");

  useEffect(() => {
    setPrintDate(new Date().toLocaleDateString());

    const beforePrintHandler = () => {
      document.title = "Inventory Materials - BuildTrack";
    };

    window.addEventListener('beforeprint', beforePrintHandler);
    
    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
    };
  }, []);

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status)
        ? prev.filter(item => item !== status)
        : [...prev, status]
    );
  };

  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev => 
      prev.includes(type)
        ? prev.filter(item => item !== type)
        : [...prev, type]
    );
  };
  
  const filteredMaterials = materials?.filter(material => {
    const matchesSearch = material.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleExport = () => {
    const header = ['Material', 'Quantity', 'Date'];
    
    const csvContent = [
      header.join(','),
      ...(filteredMaterials || []).map(material => [
        material.material,
        material.quantity,
        material.date
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'materials.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-gray-500" size={20} />
            <h2 className="text-lg font-medium">Materials</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <Button variant="outline" size="sm" className="h-9" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            
            <Button 
              size="sm" 
              className="h-9 bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={onAddMaterial}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Material
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <MaterialsTable
          materials={filteredMaterials}
          isLoading={isLoading}
          onUpdated={refetch}
        />
      </div>
      
      {/* <div className="print-title" data-print-date={printDate}>
        Inventory Materials
      </div> */}
    </div>
  );
};

export default MaterialsView;
