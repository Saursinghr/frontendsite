import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import SiteCard from '@/components/sites/SiteCard';
import AddSiteModal from '@/components/sites/AddSiteModal';
import { getAllSites, addNewSite, getDashboardStats, SiteResponse } from '@/services/siteService';
import { getTeamMembers, Employee } from '@/services/teamService';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = () => {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSites: 0,
    activeProjects: 0,
    totalBudget: 0,
    totalTeamMembers: 0
  });
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  // Fetch sites and team members on component mount
  useEffect(() => {
    fetchSites();
    fetchTeamMembers();
    fetchDashboardStats();
  }, []);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const sitesData = await getAllSites();
      setSites(sitesData);
      
      // Calculate stats from sites data as fallback
      const calculatedStats = {
        totalSites: sitesData.length,
        activeProjects: sitesData.length,
        totalBudget: sitesData.reduce((sum, site) => sum + (site.estimatedBudget || 0), 0),
        totalTeamMembers: sitesData.reduce((sum, site) => sum + (site.teamSize || 0), 0)
      };
      setDashboardStats(calculatedStats);
    } catch (err) {
      setError('Failed to fetch sites');
      toast.error('Failed to load sites');
      console.error('Error fetching sites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setIsLoadingTeamMembers(true);
      const response = await getTeamMembers({ status: 'Active' });
      
      // Check if response has employees property
      if (response && response.employees && Array.isArray(response.employees)) {
        // Convert the response to match the User type expected by AddSiteModal
        const formattedTeamMembers = response.employees.map((employee: Employee) => ({
          id: employee._id || '',
          name: employee.name,
          role: employee.position,
          email: employee.email
        }));
        setTeamMembers(formattedTeamMembers);
        console.log('Formatted team members:', formattedTeamMembers); // Debug log
      } else {
        console.error('Invalid response format from getTeamMembers:', response);
        setTeamMembers([]);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      toast.error('Failed to load team members');
      setTeamMembers([]);
    } finally {
      setIsLoadingTeamMembers(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const stats = await getDashboardStats();
      setDashboardStats(stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Fallback to calculating from sites data
      const calculatedStats = {
        totalSites: sites.length,
        activeProjects: sites.length,
        totalBudget: sites.reduce((sum, site) => sum + (site.estimatedBudget || 0), 0),
        totalTeamMembers: sites.reduce((sum, site) => sum + (site.teamSize || 0), 0)
      };
      setDashboardStats(calculatedStats);
    }
  };

  const handleAddSite = async (newSite: any) => {
    try {
      // Transform the form data to match the API structure
      const siteData = {
        siteName: newSite.name,
        siteCode: newSite.code || generateSiteCode(newSite.name),
        address: newSite.address,
        estimatedBudget: parseFloat(newSite.budget) || 0,
        teamSize: parseInt(newSite.teamSize) || 0,
        startDate: newSite.startDate,
        endDate: newSite.endDate || calculateEndDate(newSite.startDate, newSite.durationValue, newSite.durationUnit),
        assignedUsers: newSite.assignedUsers || []
      };

      const addedSite = await addNewSite(siteData);
      setSites((prevSites) => [addedSite, ...prevSites]);
      
      // Refresh dashboard stats after adding new site
      await fetchDashboardStats();
      
      toast.success('New site added successfully!');
      setIsAddSiteModalOpen(false);
    } catch (err) {
      toast.error('Failed to add site');
      console.error('Error adding site:', err);
    }
  };

  // Helper function to generate site code
  const generateSiteCode = (siteName: string) => {
    const initials = siteName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase();
    const year = new Date().getFullYear();
    return `${initials}-${year}`;
  };

  // Helper function to calculate end date
  const calculateEndDate = (startDate: string, durationValue: string, durationUnit: string) => {
    if (!startDate || !durationValue) return startDate;
    
    const start = new Date(startDate);
    const duration = parseInt(durationValue);
    
    switch (durationUnit) {
      case 'months':
        start.setMonth(start.getMonth() + duration);
        break;
      case 'weeks':
        start.setDate(start.getDate() + (duration * 7));
        break;
      case 'days':
        start.setDate(start.getDate() + duration);
        break;
      default:
        start.setMonth(start.getMonth() + duration);
    }
    
    return start.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <Header title="Construction Site Dashboard" />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500">Loading sites...</p>
              </div>
            </div>
          </main>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <Header title="Construction Site Dashboard" />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchSites}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </div>
          </main>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title="Construction Site Dashboard"
          onAddSite={() => setIsAddSiteModalOpen(true)}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500">Total Sites</h3>
                <p className="text-2xl font-bold">{dashboardStats.totalSites}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
                <p className="text-2xl font-bold">{dashboardStats.activeProjects}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
                <p className="text-2xl font-bold">
                  ₹{dashboardStats.totalBudget.toLocaleString()}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white p-6 rounded-lg border shadow-sm"
              >
                <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
                <p className="text-2xl font-bold">
                  {dashboardStats.totalTeamMembers}
                </p>
              </motion.div>
            </div>

            {/* Sites Grid - Now Full Width */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Construction Sites</h2>
              
              {sites.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500 mb-4">No sites found</p>
                  <button
                    onClick={() => setIsAddSiteModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Add Your First Site
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {sites.map((site, index) => (
                    <motion.div
                      key={site._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full"
                    >
                      <SiteCard
                        id={site._id}
                        name={site.siteName}
                        code={site.siteCode}
                        address={site.address}
                        completionPercentage={0} // You can add this field to your backend model
                        status="in-progress" // You can add this field to your backend model
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <ErrorBoundary>
          <AddSiteModal
            isOpen={isAddSiteModalOpen}
            onClose={() => setIsAddSiteModalOpen(false)}
            onAddSite={handleAddSite}
            users={teamMembers}
            isLoading={isLoading || isLoadingTeamMembers}
          />
        </ErrorBoundary>
      </div>
    </MainLayout>
  );
};

export default Dashboard;