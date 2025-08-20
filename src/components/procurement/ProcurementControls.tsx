import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Download, Plus, Search } from "lucide-react";

interface ProcurementControlsProps {
  search: string;
  setSearch: (s: string) => void;
  status: string;
  setStatus: (s: string) => void;
  vendor: string;
  setVendor: (v: string) => void;
  allVendors: string[];
  onCreate: () => void;
}

export function ProcurementControls({
  search,
  setSearch,
  status,
  setStatus,
  vendor,
  setVendor,
  allVendors,
  onCreate,
}: ProcurementControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          className="pl-10 w-full bg-white border rounded-md"
          placeholder="Search by item, vendor, or status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 bg-white border rounded-md flex gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="all" className="hover:bg-gray-50">All Statuses</SelectItem>
            <SelectItem value="pending" className="hover:bg-yellow-50 text-yellow-800">⏳ Pending</SelectItem>
            <SelectItem value="approved" className="hover:bg-blue-50 text-blue-800">✅ Approved</SelectItem>
            <SelectItem value="delivered" className="hover:bg-green-50 text-green-800">📦 Delivered</SelectItem>
            <SelectItem value="cancelled" className="hover:bg-red-50 text-red-800">❌ Cancelled</SelectItem>
            <SelectItem value="in transit" className="hover:bg-blue-50 text-blue-800">🚚 In Transit</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={vendor} onValueChange={setVendor}>
          <SelectTrigger className="w-40 bg-white border rounded-md flex gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="All Vendors" />
          </SelectTrigger>
          <SelectContent className="bg-white rounded-md shadow-md border z-50">
            <SelectItem value="all">All Vendors</SelectItem>
            {allVendors.map(v => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          className="bg-white border rounded-md hidden md:flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        
        <Button 
          className="ml-1  font-medium rounded-md flex items-center gap-2"
          onClick={onCreate}
        >
          <Plus className="h-4 w-4" />
          Create Purchase Request
        </Button>
      </div>
    </div>
  );
}
