import React, { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Material } from "@/types/inventory";
import ViewMaterialDialog from "./ViewMaterialDialog";
import UpdateMaterialDialog from "./UpdateMaterialDialog";

interface MaterialsTableProps {
  materials: any[]; // Accept both Material types
  isLoading: boolean;
  onUpdated?: () => void;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ materials, isLoading, onUpdated }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleView = (material: any) => {
    setSelectedMaterial(material);
    setIsViewDialogOpen(true);
  };

  const handleUpdate = (material: any) => {
    setSelectedMaterial(material);
    setIsUpdateDialogOpen(true);
  };

  const getStockLevelColor = (percentage: number): string => {
    return percentage >= 70 
      ? "bg-green-500" 
      : percentage >= 40 
        ? "bg-yellow-500" 
        : "bg-red-500";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In Stock": {
        bg: 'bg-green-100',
        text: 'text-green-800',
        hover: 'hover:bg-green-200',
        icon: '📦'
      },
      "Low Stock": {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        hover: 'hover:bg-yellow-200',
        icon: '⚠️'
      },
      "Out of Stock": {
        bg: 'bg-red-100',
        text: 'text-red-800',
        hover: 'hover:bg-red-200',
        icon: '❌'
      }
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} ${config.hover}`}>
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading materials...</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-t border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Material</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Quantity</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Unit</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Purpose</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Stock Level</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {materials.map((material) => (
              <tr key={material._id || material.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{material.material}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{material.quantity}</td>
                <td className="px-6 py-4 text-gray-600">{material.unit}</td>
                <td className="px-6 py-4 text-gray-600">
                  {material.purpose || <span className="text-gray-400">No purpose specified</span>}
                </td>
                <td className="px-6 py-4">{getStatusBadge(material.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getStockLevelColor(material.stockLevel)}`}
                          style={{ width: `${material.stockLevel}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{material.stockLevel}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleView(material)}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(material)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Update
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ViewMaterialDialog
        material={selectedMaterial}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <UpdateMaterialDialog
        material={selectedMaterial}
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onUpdated={onUpdated}
      />
    </>
  );
};

export default MaterialsTable;
