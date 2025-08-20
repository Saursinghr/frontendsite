
import { ProcurementRequest } from "./ProcurementTable";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import { Eye, Edit, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface ProcurementTableRowProps {
  request: ProcurementRequest;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onSave: () => void;
}

export function ProcurementTableRow({
  request,
  selected,
  onSelect,
  onView,
  onEdit,
  onSave,
}: ProcurementTableRowProps) {
  return (
    <tr
      className={cn(
        selected ? "bg-blue-50" : "hover:bg-muted/30 animate-fade-in-slide",
        "transition-colors"
      )}
    >
      <td className="p-4">
        <input type="checkbox" checked={selected} onChange={onSelect} className="accent-blue-600 h-4 w-4" />
      </td>
      <td className="p-4 font-medium">{request.item}</td>
      <td className="p-4">{request.quantity}</td>
      <td className="p-4 flex items-center gap-2">
        {request.vendor}
        {request.vendorRating !== undefined && (
          <span className="ml-1">
            <StarRating rating={request.vendorRating} size="sm" readonly />
          </span>
        )}
      </td>
      <td className="p-4">{typeof request.requestDate === "string" ? request.requestDate : new Date(request.requestDate).toLocaleDateString()}</td>
      <td className="p-4">{typeof request.deliveryDate === "string" ? request.deliveryDate : new Date(request.deliveryDate).toLocaleDateString()}</td>
      <td className="p-4 whitespace-nowrap">
        {request.status === "canceled" && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
            <span>Cancelled</span>
          </span>
        )}
        {request.status === "pending" && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <span>Pending</span>
          </span>
        )}
        {request.status === "approved" && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
            <span>Approved</span>
          </span>
        )}
        {request.status === "in transit" && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
            <span>In Transit</span>
          </span>
        )}
        {request.status === "delivered" && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1">
            <span>Delivered</span>
          </span>
        )}
        {request.deliveryTracking && (
          <div className="text-xs text-muted-foreground mt-1">
            Tracking: {request.deliveryTracking}
          </div>
        )}
      </td>
      <td className="p-4 flex items-center gap-2 justify-end min-w-[100px]">
        <Button size="icon" variant="ghost" onClick={onView}><Eye className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" onClick={onEdit}><Edit className="w-4 h-4" /></Button>
        {/* "Save" visible for all as per UI; normally only if row is dirty */}
        <Button size="icon" variant="ghost" onClick={onSave}><Save className="w-4 h-4" /></Button>
      </td>
    </tr>
  );
}
