import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, MoreHorizontal, ChevronUp, ChevronDown, Check, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProcurementRequest {
  id: string;
  item: string;
  quantity: number;
  vendor: string;
  requestDate: Date | string;
  deliveryDate: Date | string;
  status: string;
  priority?: string;
  vendorRating?: number;
  deliveryTracking?: string;
  notes?: string;
  cost?: number;
}

interface ProcurementTableProps {
  requests: ProcurementRequest[];
  isLoading: boolean;
  onViewDetails: (request: ProcurementRequest) => void;
  onEditRequest: (request: ProcurementRequest) => void;
  onStatusChange: (id: string, status: string) => void;
  onBulkAction: (ids: string[], action: string) => void;
}

export function ProcurementTable({
  requests,
  isLoading,
  onViewDetails,
  onEditRequest,
  onStatusChange,
  onBulkAction,
}: ProcurementTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof ProcurementRequest | null>("requestDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof ProcurementRequest) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedRequests = [...requests].sort((a, b) => {
    if (!sortField) return 0;

    let aValue = a[sortField];
    let bValue = b[sortField];

    // Convert dates to numbers for comparison
    if (sortField === "requestDate" || sortField === "deliveryDate") {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSelectAll = () => {
    if (selectedRows.length === requests.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(requests.map((r) => r.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const renderSortIcon = (field: keyof ProcurementRequest) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  const getStatusBadge = (status: string) => {
    // Use the Status field directly for display
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 font-medium px-3 py-1 rounded-full">
            <Check className="h-3 w-3" /> Approved
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1 font-medium px-3 py-1 rounded-full">
            <Package className="h-3 w-3" /> Delivered
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1 font-medium px-3 py-1 rounded-full">
            Pending
          </Badge>
        );
      case "cancelled":
      case "canceled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1 font-medium px-3 py-1 rounded-full">
            Cancelled
          </Badge>
        );
      case "in_transit":
      case "in transit":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-1 font-medium px-3 py-1 rounded-full">
            <Truck className="h-3 w-3" /> In Transit
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1 font-medium px-3 py-1 rounded-full">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateValue: Date | string) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        Loading procurement requests...
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-md border shadow-sm">
      {/* Bulk action toolbar */}
      {selectedRows.length > 0 && (
        <div className="absolute top-0 left-0 right-0 bg-muted z-10 py-2 px-4 flex items-center justify-between animate-fade-in">
          <span className="text-sm font-medium">
            {selectedRows.length} item(s) selected
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onBulkAction(selectedRows, "approved");
                setSelectedRows([]);
              }}
            >
              Mark Approved
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onBulkAction(selectedRows, "delivered");
                setSelectedRows([]);
              }}
            >
              Mark Delivered
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                onBulkAction(selectedRows, "cancelled");
                setSelectedRows([]);
              }}
            >
              Cancel Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-10">
                <Checkbox 
                  checked={selectedRows.length === requests.length && requests.length > 0} 
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="min-w-[180px]">Item</TableHead>
              <TableHead className="w-24">Quantity</TableHead>
              <TableHead className="min-w-[150px]">Vendor</TableHead>
                             <TableHead 
                 className="cursor-pointer whitespace-nowrap min-w-[120px]" 
                 onClick={() => handleSort("requestDate")}
               >
                 Request Date {renderSortIcon("requestDate")}
               </TableHead>
               <TableHead 
                 className="cursor-pointer whitespace-nowrap min-w-[120px]" 
                 onClick={() => handleSort("deliveryDate")}
               >
                 Expected Delivery {renderSortIcon("deliveryDate")}
               </TableHead>
              <TableHead className="min-w-[140px]">Status</TableHead>
              <TableHead className="text-right min-w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <p className="text-muted-foreground">
                    No procurement requests found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              sortedRequests.map((request) => (
                <TableRow 
                  key={request.id} 
                  className={
                    selectedRows.includes(request.id) 
                      ? "bg-muted/40" 
                      : "hover:bg-gray-50 animate-fade-in"
                  }
                >
                  <TableCell>
                    <Checkbox 
                      checked={selectedRows.includes(request.id)}
                      onCheckedChange={() => handleSelectRow(request.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {request.item}
                  </TableCell>
                  <TableCell>
                    {request.quantity}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {request.vendor}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(request.requestDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(request.deliveryDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(request.status)}
                      {(request.status.toLowerCase() === "delivered" || 
                        request.status.toLowerCase() === "in transit") && 
                        request.deliveryTracking && (
                        <div className="text-xs text-gray-500">
                          Tracking: {request.deliveryTracking}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewDetails(request)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEditRequest(request)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border rounded-md">
                          <DropdownMenuItem 
                            onClick={() => onStatusChange(request.id, "approved")}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <Check className="mr-2 h-4 w-4 text-blue-600" />
                            <span>Mark as Approved</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onStatusChange(request.id, "delivered")}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <Package className="mr-2 h-4 w-4 text-green-600" />
                            <span>Mark as Delivered</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onStatusChange(request.id, "in transit")}
                            className="cursor-pointer hover:bg-gray-50"
                          >
                            <Truck className="mr-2 h-4 w-4 text-blue-600" />
                            <span>Mark as In Transit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onStatusChange(request.id, "cancelled")}
                            className="text-red-600 cursor-pointer hover:bg-red-50"
                          >
                            <span>Cancel Request</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}