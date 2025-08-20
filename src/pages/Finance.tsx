
import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  ClipboardList,
  Search,
  Filter, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import FinanceDashboard from "@/components/finance/FinanceDashboard";
import { useParams, useLocation } from "react-router-dom";
import { getAllSites, type SiteResponse } from '@/services/siteService';
import Header from "@/components/layout/Header";
import { getFinances, updateFinance, deleteFinance, type Finance } from '@/services/financeService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FinancePage = () => {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Fetch sites from backend
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setSitesLoading(true);
        console.log('Fetching sites...');
        const sitesData = await getAllSites();
        console.log('Sites data received:', sitesData);
        // Ensure sitesData is an array
        if (Array.isArray(sitesData)) {
          setSites(sitesData);
        } else {
          console.error('Invalid sites data format:', sitesData);
          setSites([]);
        }
      } catch (error) {
        console.error('Failed to fetch sites:', error);
        toast.error('Failed to fetch sites');
        setSites([]);
      } finally {
        setSitesLoading(false);
      }
    };

    fetchSites();
  }, []);

  // Get site from URL params or query params
  useEffect(() => {
    if (sites.length > 0) {
      const siteId = id;
      if (siteId) {
        const site = sites.find(site => site._id === siteId);
        if (site) {
          setSelectedSite(site);
          setSelectedSiteId(siteId);
        }
      } else {
        // If no site ID in URL, don't select any site by default
        setSelectedSite(null);
        setSelectedSiteId(null);
      }
    }
  }, [id, sites]);

  const handleSiteChange = (siteId: string) => {
    const site = sites.find(s => s._id === siteId);
    if (site) {
      setSelectedSite(site);
      setSelectedSiteId(siteId);
    }
  };

  return (
    <MainLayout>
      <Header
        title="Finance Management"
        showSiteSelector={true}
        selectedSite={selectedSiteId}
        sites={sites}
        onSelectSite={handleSiteChange}
        onChangeSite={() => {
          setSelectedSite(null);
          setSelectedSiteId("");
        }}
      />
      <main className="px-2 sm:px-4 py-4 sm:py-6 md:px-6 md:py-8 max-w-[1600px] mx-auto animate-fade-in">
        {sitesLoading && (
          <div className="text-center text-sm text-gray-500 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            Loading sites...
          </div>
        )}

        {!sitesLoading && sites.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8">
            No sites found. Please add some sites first.
          </div>
        )}

        {!sitesLoading && sites.length > 0 && !selectedSite && (
          <div className="text-center text-sm text-gray-500 py-8">
            Please select a site to manage finances.
          </div>
        )}

        {!sitesLoading && selectedSite && (
          <FinanceDashboard
            siteId={selectedSiteId}
            siteName={selectedSite.siteName}
          />
        )}
      </main>
    </MainLayout>
  );
};

export default FinancePage;