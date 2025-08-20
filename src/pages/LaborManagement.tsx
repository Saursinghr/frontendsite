import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, Search } from 'lucide-react';

import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
// import { sites } from '@/services/mockData';
import LaborTable from '@/components/labor/LaborTable';
import { getAttendance } from '@/services/attendanceService';
import { toast } from 'sonner';
import { getAllSites, SiteResponse } from '@/services/siteService';

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch sites
  useEffect(() => {
    getAllSites()
      .then(setSites)
      .catch((error) => {
        console.error('Error fetching sites:', error);
      });
  }, []);

  // Set selected site based on URL parameter
  useEffect(() => {
    if (id && sites.length > 0) {
      const site = sites.find(site => site._id === id);
      if (site) {
        setSelectedSite(site);
        setShowSiteSelector(false);
      }
    } else if (!id) {
      setSelectedSite(null);
      setShowSiteSelector(true);
    }
  }, [id, sites]);

  useEffect(() => {
    if (selectedSite && selectedSite._id) {
      setLoading(true);
      getAttendance(selectedSite._id)
        .then(data => setAttendance(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else if (!selectedSite) {
      setAttendance([]);
      setLoading(false);
    }
  }, [selectedSite]);

  const handleSelectSite = (siteId: string) => {
    navigate(`/labor/${siteId}`);
  };

  const handleChangeSite = () => {
    console.log('Change Site clicked');
    navigate(`/labor`);
  };

  if (loading) return <div>Loading attendance...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredAttendance = attendance.filter((item: any) => {
    const matchesSearchQuery = (
      item.employeeId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeId?.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesRole = selectedRole === 'All Roles' || item.employeeId?.position === selectedRole;
    const matchesStatus = selectedStatus === 'All Status' || 
                          (selectedStatus === 'Checked In' && item.status === 'present') ||
                          (selectedStatus === 'Absent' && item.status === 'absent');

    return matchesSearchQuery && matchesRole && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Attendance Management` : 'Attendance Management'}
          showSiteSelector={showSiteSelector}
          selectedSite={selectedSite?._id}
          sites={sites}
          onSelectSite={handleSelectSite}
          onChangeSite={handleChangeSite}
        />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Employee Workers</h1>
              <p className="text-gray-500">Manage all labor workers across sites</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Attendance Summary</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Jul 28 - Aug 02</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <p className="text-sm text-gray-500">Total Workers</p>
                  <p className="text-2xl font-bold">{attendance.length}</p>
                </Card>
                <Card className="p-4 text-center bg-green-50 border-green-200">
                  <p className="text-sm text-green-700">Checked In</p>
                  <p className="text-2xl font-bold text-green-700">{attendance.filter((item: any) => item.status === 'present').length}</p>
                </Card>
                <Card className="p-4 text-center bg-red-50 border-red-200">
                  <p className="text-sm text-red-700">Absent</p>
                  <p className="text-2xl font-bold text-red-700">{attendance.filter((item: any) => item.status === 'absent').length}</p>
                </Card>
                <Card className="p-4 text-center bg-blue-50 border-blue-200">
                  <p className="text-sm text-blue-700">Attendance Rate</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {attendance.length > 0
                      ? `${Math.round((attendance.filter((item: any) => item.status === 'present').length / attendance.length) * 100)}%`
                      : '0%'}
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or role..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between">
                  <Filter className="mr-2 h-4 w-4" />
                  Role: All
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setSelectedRole('All Roles')} className="hover:bg-gray-50">All Roles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole('Manager')} className="hover:bg-blue-50 text-blue-800">👔 Manager</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRole('Laborer')} className="hover:bg-orange-50 text-orange-800">👷 Laborer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto justify-between">
                  Status: All
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg">
                <DropdownMenuItem onClick={() => setSelectedStatus('All Status')} className="hover:bg-gray-50">All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('Checked In')} className="hover:bg-green-50 text-green-800">🟢 Checked In</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('Absent')} className="hover:bg-red-50 text-red-800">🔴 Absent</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Workers</TabsTrigger>
              <TabsTrigger value="active">Active Now</TabsTrigger>
              <TabsTrigger value="absent">Absent</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <LaborTable workers={filteredAttendance.map((item: any) => ({
                  id: item.employeeId?._id || item._id,
                  name: item.employeeId?.name || 'N/A',
                  role: item.employeeId?.position || '',
                  email: item.employeeId?.email || 'N/A',
                  phone: item.employeeId?.phone || 'N/A',
                  status: item.status === 'present' ? 'Clocked In' : 'Clocked Out',
                  lastActivity: item.clockOut?.time ? new Date(item.clockOut.time).toLocaleTimeString() : (item.clockIn?.time ? new Date(item.clockIn.time).toLocaleTimeString() : 'N/A'),
                  clockIn: item.clockIn ? { time: new Date(item.clockIn.time).toLocaleTimeString(), location: item.clockIn.location || 'N/A' } : undefined,
                  clockOut: item.clockOut ? { time: new Date(item.clockOut.time).toLocaleTimeString(), location: item.clockOut.location || 'N/A' } : undefined,
                }))} />
              </TabsContent>
              <TabsContent value="active">
                {/* Filtered active workers */}
                <LaborTable workers={filteredAttendance.filter((item: any) => item.status === 'present').map((item: any) => ({
                  id: item.employeeId?._id || item._id,
                  name: item.employeeId?.name || 'N/A',
                  role: item.employeeId?.position || '',
                  email: item.employeeId?.email || 'N/A',
                  phone: item.employeeId?.phone || 'N/A',
                  status: 'Clocked In',
                  lastActivity: item.clockOut?.time ? new Date(item.clockOut.time).toLocaleTimeString() : (item.clockIn?.time ? new Date(item.clockIn.time).toLocaleTimeString() : 'N/A'),
                  clockIn: item.clockIn ? { time: new Date(item.clockIn.time).toLocaleTimeString(), location: item.clockIn.location || 'N/A' } : undefined,
                  clockOut: item.clockOut ? { time: new Date(item.clockOut.time).toLocaleTimeString(), location: item.clockOut.location || 'N/A' } : undefined,
                }))} />
              </TabsContent>
              <TabsContent value="absent">
                {/* Filtered absent workers */}
                <LaborTable workers={filteredAttendance.filter((item: any) => item.status === 'absent').map((item: any) => ({
                  id: item.employeeId?._id || item._id,
                  name: item.employeeId?.name || 'N/A',
                  role: item.employeeId?.position || '',
                  email: item.employeeId?.email || 'N/A',
                  phone: item.employeeId?.phone || 'N/A',
                  status: 'Clocked Out',
                  lastActivity: item.clockOut?.time ? new Date(item.clockOut.time).toLocaleTimeString() : (item.clockIn?.time ? new Date(item.clockIn.time).toLocaleTimeString() : 'N/A'),
                  clockIn: item.clockIn ? { time: new Date(item.clockIn.time).toLocaleTimeString(), location: item.clockIn.location || 'N/A' } : undefined,
                  clockOut: item.clockOut ? { time: new Date(item.clockOut.time).toLocaleTimeString(), location: item.clockOut.location || 'N/A' } : undefined,
                }))} />
              </TabsContent>
          </Tabs>
        </main>
      </div>
    </MainLayout>
  );
};

export default AttendanceManagement;