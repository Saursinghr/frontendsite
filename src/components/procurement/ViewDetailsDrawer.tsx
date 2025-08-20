
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { ProcurementRequest } from "./ProcurementTable";
import { StarRating } from "./StarRating";

interface ViewDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  request: ProcurementRequest;
  onStatusChange: (status: string) => void;
}

export function ViewDetailsDrawer({ 
  open, 
  onClose, 
  request,
  onStatusChange
}: ViewDetailsDrawerProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="status-badge-approved">Approved</Badge>;
      case "delivered":
        return <Badge className="status-badge-delivered">Delivered</Badge>;
      case "pending":
        return <Badge className="status-badge-pending">Pending</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-800 status-badge">Canceled</Badge>;
      case "in transit":
        return <Badge className="bg-blue-100 text-blue-800 status-badge">In Transit</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "low":
        return <Badge className="priority-badge-low">Low</Badge>;
      case "medium":
        return <Badge className="priority-badge-medium">Medium</Badge>;
      case "high":
        return <Badge className="priority-badge-high">High</Badge>;
      default:
        return <Badge variant="outline">Medium</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return typeof date === "string" ? date : format(date, "PPP");
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md lg:max-w-lg overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle>Purchase Request Details</SheetTitle>
          <SheetDescription>
            Details for purchase request #{request.id.substring(0, 8)}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{request.item}</h3>
            {getStatusBadge(request.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quantity</p>
              <p>{request.quantity}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Vendor</p>
              <p>{request.vendor}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Request Date</p>
              <p>{formatDate(request.requestDate)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Delivery Date</p>
              <p>{formatDate(request.deliveryDate)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Priority</p>
              <div className="mt-1">{getPriorityBadge(request.priority || "medium")}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost</p>
              <p>{request.cost ? `$${request.cost.toFixed(2)}` : "Not specified"}</p>
            </div>
          </div>

          {request.deliveryTracking && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Delivery Tracking</p>
              <p>{request.deliveryTracking}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-muted-foreground">Vendor Rating</p>
            <StarRating 
              rating={request.vendorRating || 0} 
              maxRating={5} 
              readonly 
            />
          </div>

          {request.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm mt-1">{request.notes}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Update Status</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange("pending")}
                className={request.status === "pending" ? "border-yellow-500 bg-yellow-50" : ""}
              >
                Pending
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange("approved")}
                className={request.status === "approved" ? "border-blue-500 bg-blue-50" : ""}
              >
                Approved
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange("in transit")}
                className={request.status === "in transit" ? "border-blue-500 bg-blue-50" : ""}
              >
                In Transit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange("delivered")}
                className={request.status === "delivered" ? "border-green-500 bg-green-50" : ""}
              >
                Delivered
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStatusChange("canceled")}
                className={
                  request.status === "canceled" 
                    ? "border-red-500 bg-red-50 text-red-600" 
                    : "text-red-600 hover:bg-red-50"
                }
              >
                Canceled
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
