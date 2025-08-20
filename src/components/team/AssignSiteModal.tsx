import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";
import { assignEmployeeToSites } from "@/services/teamService";
import { getAllSites, SiteResponse, updateSiteAssignedUsers } from "@/services/siteService";

interface AssignSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    assignedSite?: string[] | string;
  } | null;
  onSiteAssigned: () => void;
}

export const AssignSiteModal: React.FC<AssignSiteModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSiteAssigned,
}) => {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSites();
      // Handle both array and string formats for backward compatibility
      if (employee?.assignedSite) {
        if (Array.isArray(employee.assignedSite)) {
          setSelectedSites(employee.assignedSite);
        } else {
          setSelectedSites([employee.assignedSite]);
        }
      } else {
        setSelectedSites([]);
      }
    }
  }, [isOpen, employee]);

  const fetchSites = async () => {
    try {
      const sitesData = await getAllSites();
      setSites(sitesData);
    } catch (error) {
      console.error("Error fetching sites:", error);
      toast.error("Failed to fetch sites");
    }
  };

  const handleAddSite = (siteName: string) => {
    if (!selectedSites.includes(siteName)) {
      setSelectedSites([...selectedSites, siteName]);
    }
  };

  const handleRemoveSite = (siteName: string) => {
    setSelectedSites(selectedSites.filter(site => site !== siteName));
  };

  const handleAssignSites = async () => {
    if (!employee) {
      toast.error("No employee selected");
      return;
    }

    setIsLoading(true);
    try {
      // Get current assigned sites for comparison
      const currentSites = Array.isArray(employee.assignedSite) 
        ? employee.assignedSite 
        : employee.assignedSite ? [employee.assignedSite] : [];

      // Remove employee from sites that are no longer assigned
      const sitesToRemove = currentSites.filter(site => !selectedSites.includes(site));
      for (const siteName of sitesToRemove) {
        const site = sites.find(s => s.siteName === siteName);
        if (site) {
          try {
            await updateSiteAssignedUsers(site._id, employee.id, 'remove');
          } catch (error) {
            console.error('Error removing employee from site:', siteName, error);
          }
        }
      }

      // Add employee to new sites
      const sitesToAdd = selectedSites.filter(site => !currentSites.includes(site));
      for (const siteName of sitesToAdd) {
        const site = sites.find(s => s.siteName === siteName);
        if (site) {
          try {
            await updateSiteAssignedUsers(site._id, employee.id, 'add');
          } catch (error) {
            console.error('Error adding employee to site:', siteName, error);
          }
        }
      }

      // Update employee's assigned sites
      await assignEmployeeToSites(employee.id, selectedSites, 'replace');

      toast.success(`${employee.name} assigned to ${selectedSites.length} site(s) successfully!`);
      onSiteAssigned();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign employee to sites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSites([]);
    onClose();
  };

  const getAvailableSites = () => {
    return sites.filter(site => !selectedSites.includes(site.siteName));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-blue-800 font-bold">Assign Employee to Sites</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {employee && (
            <div className="space-y-2">
              <Label className="text-blue-700 font-medium">Employee</Label>
              <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                <p className="font-semibold text-gray-800">{employee.name}</p>
                {selectedSites.length > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    Currently assigned to: <span className="font-medium">{selectedSites.length} site(s)</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-blue-700 font-medium">Selected Sites</Label>
            <div className="min-h-[60px] p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
              {selectedSites.length === 0 ? (
                <p className="text-gray-500 text-sm">No sites selected</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedSites.map((siteName) => (
                    <Badge 
                      key={siteName} 
                      variant="secondary" 
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {siteName}
                      <button
                        type="button"
                        onClick={() => handleRemoveSite(siteName)}
                        className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site" className="text-blue-700 font-medium">Add Site</Label>
            <Select 
              value="" 
              onValueChange={handleAddSite}
              disabled={getAvailableSites().length === 0}
            >
              <SelectTrigger id="site" className="bg-white border-blue-300 focus:border-blue-500">
                <SelectValue placeholder={getAvailableSites().length === 0 ? "All sites assigned" : "Choose a site to add"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                {getAvailableSites().map((site) => (
                  <SelectItem key={site._id} value={site.siteName} className="hover:bg-blue-50">
                    <div className="flex flex-col">
                      <span className="font-medium">{site.siteName}</span>
                      <span className="text-xs text-gray-500">{site.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignSites} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Assigning..." : "Assign to Sites"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
