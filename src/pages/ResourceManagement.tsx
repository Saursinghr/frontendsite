import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, ChevronDown, FolderOpen, ClipboardList, Users } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getAllSites } from '@/services/siteService';
import ResourceTable from '@/components/resource/ResourceTable';
import AddResourceModal from '@/components/resource/AddResourceModal';
import { resourceInventory } from '@/services/mockData';

const ResourceManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resources, setResources] = useState(resourceInventory);
  const [filteredResources, setFilteredResources] = useState(resourceInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sites, setSites] = useState([]);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const siteId = id ? parseInt(id) : null;
  const selectedSite = siteId ? sites.find(site => site.id === siteId) : null;

  useEffect(() => {
    getAllSites().then(setSites);
  }, []);

  useEffect(() => {
    let result = [...resources];

    if (typeFilter !== 'all') {
      result = result.filter(resource => resource.type === typeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(resource =>
        resource.name.toLowerCase().includes(query)
      );
    }

    setFilteredResources(result);
  }, [resources, searchQuery, typeFilter]);

  const handleAddResource = (newResource: any) => {
    const resource = {
      id: resources.length + 1,
      ...newResource,
      status: 'Available',
      lastUpdated: new Date().toLocaleDateString()
    };
    setResources(prev => [resource, ...prev]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Resource Management` : 'Resource Management'}
          showSiteSelector={!selectedSite}
          selectedSite={selectedSite?.siteName}
          sites={sites}
        />

        <main className="flex-1 overflow-auto p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={childVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Project Resources</h1>
                <p className="text-gray-500">
                  {selectedSite
                    ? `Manage equipment, materials, and tools at ${selectedSite.siteName}`
                    : 'Manage all resources across project sites'}
                </p>
              </div>

              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus size={18} className="mr-2 bg-white" />
                Add Resource
              </Button>
            </motion.div>

            <motion.div variants={childVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <FolderOpen className="text-blue-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">Total Resources</p>
                    <p className="text-xl font-bold">{resources.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <ClipboardList className="text-green-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="text-xl font-bold">{resources.filter(r => r.status === 'Available').length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <Users className="text-red-600" size={28} />
                  <div>
                    <p className="text-sm text-gray-500">In Use</p>
                    <p className="text-xl font-bold">{resources.filter(r => r.status === 'In Use').length}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters */}
            <motion.div variants={childVariants} className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Filter size={16} className="mr-2" />
                      Type: {typeFilter === 'all' ? 'All' : typeFilter}
                      <ChevronDown size={16} className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTypeFilter('all')}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('equipment')}>Equipment</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('material')}>Material</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter('tool')}>Tool</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            <motion.div variants={childVariants}>
              <ResourceTable resources={filteredResources} />
            </motion.div>
          </motion.div>
        </main>
      </div>

      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddResource={handleAddResource}
        sites={sites}
        siteId={siteId}
      />
    </MainLayout>
  );
};

export default ResourceManagement;