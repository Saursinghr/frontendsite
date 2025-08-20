
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Material } from "@/types/inventory";
import { useTransactions } from "@/hooks/use-transactions";
import { format } from "date-fns";

interface ViewMaterialDialogProps {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewMaterialDialog: React.FC<ViewMaterialDialogProps> = ({
  material,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const { transactions } = useTransactions({ projectId: material?.projectId });
  
  if (!material) return null;

  const materialTransactions = transactions.filter(t => t.material === material.material || t.material === material.name);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-700 bg-green-100";
      case "Low Stock":
        return "text-yellow-700 bg-yellow-100";
      case "Out of Stock":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex items-center gap-2 pb-2">
          <span className="text-xl font-semibold">{material.name}</span>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <span>Material Details</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <span>Transaction History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Material Type</h3>
                <p className="text-base">{material.type}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Storage Location</h3>
                <p className="text-base">{material.location || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Current Quantity</h3>
                <p className="text-base">{material.quantity} {material.unit}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Vendor/Supplier</h3>
                <p className="text-base">{material.vendor || "Not specified"}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Status</h3>
                <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                  {material.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Low Stock Threshold</h3>
                <p className="text-base">{material.lowStockThreshold} {material.unit}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Stock Level</h3>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        material.stockLevel >= 70 ? "bg-green-500" :
                        material.stockLevel >= 40 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${material.stockLevel}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{material.stockLevel}%</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Target Stock</h3>
                <p className="text-base">{material.targetStockLevel} {material.unit}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Purpose</h3>
                <p className="text-base">{material.purpose || "Not specified"}</p>
              </div>
            </div>

            {material.description && (
              <div className="col-span-2 mt-4">
                <h3 className="text-sm text-gray-500 mb-1">Description</h3>
                <p className="text-base text-gray-700">{material.description}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
                <div className="text-sm text-gray-500">
                  {materialTransactions.length} transactions found
                </div>
              </div>
              
              {materialTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium mb-2">No transactions found</div>
                  <div className="text-sm">This material hasn't had any transactions yet.</div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {materialTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div>
                              <div className="font-medium text-gray-900">
                                {transaction.date}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {transaction.time}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              transaction.type === "added" ? "bg-green-100 text-green-800" : 
                              transaction.type === "removed" ? "bg-red-100 text-red-800" : 
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {transaction.type === "added" ? "Added" : 
                               transaction.type === "removed" ? "Removed" : "Updated"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="text-gray-900 font-medium">
                              {transaction.quantity} {transaction.unit}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="max-w-xs">
                              {transaction.note}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMaterialDialog;
