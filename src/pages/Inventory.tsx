import { useState, useEffect } from "react";
import InventoryTabs from "@/components/inventory/InventoryTabs";
import MaterialsView from "@/components/inventory/MaterialsView";
import TransactionHistory from "@/components/inventory/TransactionHistory";
import AddMaterialDialog from "@/components/inventory/AddMaterialDialog";
import MainLayout from "@/components/layout/MainLayout";
import Header from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { getAllSites, SiteResponse } from '@/services/siteService';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState<"materials" | "transactions">("materials");
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
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
    navigate(`/inventory/${siteId}`);
  };

  const handleChangeSite = () => {
    setShowSiteSelector(true);
    navigate(`/inventory`);
  };

  const handleAddMaterial = () => {
    setIsAddMaterialOpen(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Inventory` : 'Inventory'}
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
                <h1 className="text-2xl font-bold">Inventory</h1>
                <p className="text-gray-500">Manage your construction materials and supplies</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <InventoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="mt-5">
            {activeTab === "materials" ? (
              <MaterialsView
                onAddMaterial={handleAddMaterial}
                selectedSiteId={selectedSite?._id}
              />
            ) : (
              <TransactionHistory 
                projectId={selectedSite?._id} 
                title={`${selectedSite?.siteName || 'Site'} - Transaction History`}
              />
            )}
          </div>
        </main>
      </div>

      <AddMaterialDialog
        open={isAddMaterialOpen}
        onOpenChange={setIsAddMaterialOpen}
        selectedSiteId={selectedSite?._id}
      />
    </MainLayout>
  );
};

export default Inventory;