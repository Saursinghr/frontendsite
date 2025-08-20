import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ProcurementTable } from "@/components/procurement/ProcurementTable";
import { CreateRequestDialog } from "@/components/procurement/CreateRequestDrawer";
import { EditRequestDrawer } from "@/components/procurement/EditRequestDrawer";
import { ViewDetailsDrawer } from "@/components/procurement/ViewDetailsDrawer";
import { useProcurementData } from "@/hooks/use-procurement";
import { ProcurementSummary } from "@/components/procurement/ProcurementSummary";
import { ProcurementControls } from "@/components/procurement/ProcurementControls";
import { Download, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSites, SiteResponse } from '@/services/siteService';

export default function Procurement() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch sites on component mount
  useEffect(() => {
    getAllSites().then(setSites);
  }, []);

  // Set selected site when URL changes
  useEffect(() => {
    if (id && sites.length > 0) {
      const site = sites.find(s => s._id === id);
      setSelectedSite(site || null);
      setShowSiteSelector(false);
    } else if (!id) {
      setSelectedSite(null);
      setShowSiteSelector(true);
    }
  }, [id, sites]);

  const handleSelectSite = (siteId: string) => {
    navigate(`/procurement/${siteId}`);
  };

  const handleChangeSite = () => {
    setShowSiteSelector(true);
    navigate(`/procurement`);
  };

  const {
    procurementRequests,
    isLoading,
    createRequest,
    updateRequest,
    deleteRequest,
    markAsDelivered,
    updateBulkStatus,
    handleStatusChange,
  } = useProcurementData(selectedSite?._id);

  const vendorList = Array.from(new Set(procurementRequests.map(r => r.Vendor))).sort();

  const summary = {
    total: procurementRequests.length,
    pending: procurementRequests.filter(r => r.Status === "pending" || r.Priority === "Low").length,
    approved: procurementRequests.filter(r => r.Status === "approved" || r.Priority === "Medium").length,
    delivered: procurementRequests.filter(r => r.Status === "delivered" || r.Priority === "High").length,
  };

  const filteredRequests = procurementRequests.filter((request) => {
    const matchesSearch =
      (request.ItemName ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.Vendor ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((request.Priority ?? '').toLowerCase().includes(searchTerm.toLowerCase()));

    // Map status filter to both Status and Priority values
    const statusToValues: { [key: string]: string[] } = {
      'pending': ['pending', 'Low'],
      'approved': ['approved', 'Medium'], 
      'delivered': ['delivered', 'High'],
      'all': ['all']
    };

    const matchesStatus = statusFilter === "all"
      ? true
      : statusToValues[statusFilter.toLowerCase()]?.includes(request.Status || request.Priority || '');

    const matchesVendor = vendorFilter === "all"
      ? true
      : (request.Vendor ?? '') === vendorFilter;

    return matchesSearch && matchesStatus && matchesVendor;
  });

  // Map backend fields to frontend expected fields
  const mappedRequests = filteredRequests.map((req) => ({
    id: req._id,
    item: req.ItemName,
    quantity: req.Quantity,
    vendor: req.Vendor,
    requestDate: req.RequestDate || req.DeliveryDate, // Use RequestDate if available, fallback to DeliveryDate
    deliveryDate: req.DeliveryDate,
    status: req.Status || req.Priority, // Use Status field if available, fallback to Priority
    priority: req.Priority,
    vendorRating: req.vendorRating,
    deliveryTracking: req.deliveryTracking,
    notes: req.notes,
    cost: req.cost,
  }));

  const handleCreateRequest = (requestData: any) => {
    createRequest(requestData);
    setCreateModalOpen(false);
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setViewDrawerOpen(true);
  };

  const handleEditRequest = (id: string, data: any) => {
    updateRequest(id, data);
    setEditDrawerOpen(false);
    setSelectedRequest(null);
  };



  const handleBulkAction = (ids: string[], action: string) => {
    updateBulkStatus(ids, action);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Procurement` : 'Procurement'}
          showSiteSelector={showSiteSelector}
          selectedSite={selectedSite?._id}
          sites={sites}
          onSelectSite={handleSelectSite}
          onChangeSite={handleChangeSite}
        />

        <main className="flex-1 overflow-auto p-6 bg-[#f6f7fb]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Procurement</h1>
                <p className="text-gray-500">Manage purchase orders and procurement requests</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <ProcurementSummary stats={summary} />
          
          {/* Main Content Area */}
          <div className="mt-6 space-y-4">
            {/* Controls Section */}
            <ProcurementControls
              search={searchTerm}
              setSearch={setSearchTerm}
              status={statusFilter}
              setStatus={setStatusFilter}
              vendor={vendorFilter}
              setVendor={setVendorFilter}
              allVendors={vendorList}
              onCreate={() => setCreateModalOpen(true)}
            />

            {/* Table Section */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <ProcurementTable
                requests={mappedRequests}
                isLoading={isLoading}
                onViewDetails={handleViewDetails}
                onEditRequest={(request) => {
                  setSelectedRequest(request);
                  setEditDrawerOpen(true);
                }}
                onStatusChange={handleStatusChange}
                onBulkAction={handleBulkAction}
              />
            </div>
          </div>

          {/* Modals and Drawers */}
          <CreateRequestDialog
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSubmit={handleCreateRequest}
            selectedSiteId={selectedSite?._id}
          />

          {selectedRequest && (
            <>
              <ViewDetailsDrawer
                open={viewDrawerOpen}
                onClose={() => {
                  setViewDrawerOpen(false);
                  setTimeout(() => setSelectedRequest(null), 300);
                }}
                request={selectedRequest}
                onStatusChange={(status) => handleStatusChange(selectedRequest.id, status)}
              />

              <EditRequestDrawer
                open={editDrawerOpen}
                onClose={() => {
                  setEditDrawerOpen(false);
                  setTimeout(() => setSelectedRequest(null), 300);
                }}
                request={selectedRequest}
                onSubmit={(data) => handleEditRequest(selectedRequest.id, data)}
              />
            </>
          )}
        </main>
      </div>
    </MainLayout>
  );
}