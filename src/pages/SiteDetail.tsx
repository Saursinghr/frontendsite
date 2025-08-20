import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import SiteHeader from '@/components/site/SiteHeader';
import { Button } from '@/components/ui/button';
import {
  Users,
  ClipboardList,
  MessageSquare,
  HardHat,
  Box,
  UserCog,
  FileImage,
  FileText,
  Plus,
  Download,
  Filter,
  Search,
  Send
} from 'lucide-react';
import { getSiteById, SiteResponse } from '@/services/siteService';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import { Milestone } from '@/types/milestone';
import { useMilestones, useDeleteMilestone } from '@/hooks/use-milestones';
import { MilestoneTable } from '@/components/milestones/MilestoneTable';
import { AddMilestoneDialog } from '@/components/milestones/AddMilestoneDialog';
import { EditMilestoneDialog } from '@/components/milestones/EditMilestoneDialog';

// Material and Labour imports
import { Material } from '@/types/material';
import { Labour } from '@/types/labour';
import { useMaterials } from '@/hooks/use-materials';
import { useLabour } from '@/hooks/use-labour';
import { useSitePhotos } from '@/hooks/use-site-photos';
import { getSiteExpenses, addSiteExpense, downloadSiteExpenseDocument, SiteExpense } from '@/services/siteExpenseService';
import { getChatHistory, saveChatMessage, ChatMessage } from '@/services/chatService';
import io from 'socket.io-client';
import Gallery from '@/components/site/Gallery';


// Updated material data without cost
const materialData = [
  { id: 1, name: "Concrete", quantity: "2500 m³", date: "2023-06-15" },
  { id: 2, name: "Steel Rebar", quantity: "450 tons", date: "2023-07-10" },
  { id: 3, name: "Glass Panels", quantity: "1200 units", date: "2024-01-20" },
  { id: 4, name: "Electrical Wiring", quantity: "8500 m", date: "2024-02-05" }
];

// Updated labor data with different categories
const laborData = [
  { id: 1, name: "abc", mason: 12, hours: 12500, date: "2023-06-20", workers: 15 },
  { id: 2, name: "abcd", mason: 12, hours: 8600, date: "2023-07-15", workers: 10 },
  { id: 3, name: "xyz", mason: 12, hours: 7200, date: "2023-08-01", workers: 8 },
  { id: 4, name: "abcg", mason: 12, hours: 15300, date: "2023-09-10", workers: 20 }
];

// Expense data
const initialExpenses = [
  {
    id: 1,
    name: "Concrete Delivery",
    description: "First batch of concrete for foundation",
    amount: 125000,
    username: "John Smith",
    date: "2023-06-15",
    document: "invoice_001.pdf"
  },
  {
    id: 2,
    name: "Steel Rebar",
    description: "Structural reinforcement materials",
    amount: 675000,
    username: "Sarah Johnson",
    date: "2023-07-10",
    document: "invoice_002.pdf"
  },
  {
    id: 3,
    name: "Electrical Supplies",
    description: "Wiring and components",
    amount: 425000,
    username: "Mike Brown",
    date: "2023-08-05",
    document: "invoice_003.pdf"
  }
];

// Gallery data
const galleryImages = [
  { id: 1, url: "https://example.com/image1.jpg", date: "2023-06-20", description: "Foundation work" },
  { id: 1, url: "https://example.com/image1.jpg", date: "2023-06-20", description: "Foundation work" },
  { id: 1, url: "https://example.com/image1.jpg", date: "2023-06-20", description: "Foundation work" },
  { id: 2, url: "https://example.com/image2.jpg", date: "2023-07-15", description: "Structural framing" },
  { id: 2, url: "https://example.com/image2.jpg", date: "2023-07-15", description: "Structural framing" },
  { id: 2, url: "https://example.com/image2.jpg", date: "2023-07-15", description: "Structural framing" },
  { id: 3, url: "https://example.com/image3.jpg", date: "2023-08-01", description: "Exterior walls" },
  { id: 3, url: "https://example.com/image3.jpg", date: "2023-08-01", description: "Exterior walls" },
  { id: 3, url: "https://example.com/image3.jpg", date: "2023-08-01", description: "Exterior walls" },
  { id: 3, url: "https://example.com/image3.jpg", date: "2023-08-01", description: "Exterior walls" },
  { id: 3, url: "https://example.com/image3.jpg", date: "2023-08-01", description: "Exterior walls" },
  { id: 4, url: "https://example.com/image4.jpg", date: "2023-09-10", description: "Interior work" },
  { id: 4, url: "https://example.com/image4.jpg", date: "2023-09-10", description: "Interior work" },
  { id: 4, url: "https://example.com/image4.jpg", date: "2023-09-10", description: "Interior work" },
];

// Subcontractors data
const subcontractors = [
  { id: 1, name: "ABC Electrical", contact: "Michael Johnson", phone: "(555) 123-4567", scope: "All electrical work" },
  { id: 2, name: "XYZ Concrete", contact: "Sarah Williams", phone: "(555) 987-6543", scope: "Foundation and structural concrete" },
  { id: 3, name: "Superior Plumbing", contact: "Robert Chen", phone: "(555) 456-7890", scope: "All plumbing installations" },
  { id: 4, name: "Quality Glass", contact: "Emma Davis", phone: "(555) 789-0123", scope: "Window and facade installation" }
];

// Chat messages data
const initialChatMessages = [
  { id: 1, sender: "ABC Electrical", message: "When can we schedule the panel installation?", timestamp: "2024-03-15T09:30:00", isUser: false },
  { id: 2, sender: "You", message: "Next Tuesday works for us", timestamp: "2024-03-15T10:15:00", isUser: true },
  { id: 3, sender: "XYZ Concrete", message: "We need the site cleared for pouring tomorrow", timestamp: "2024-03-16T07:45:00", isUser: false },
  { id: 4, sender: "You", message: "Will have the team clear it by EOD today", timestamp: "2024-03-16T08:30:00", isUser: true }
];

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [site, setSite] = useState<SiteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expenses, setExpenses] = useState<SiteExpense[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  // Milestone state
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isEditMilestoneOpen, setIsEditMilestoneOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get milestones for this site
  const { data: milestones = [], isLoading: milestonesLoading } = useMilestones({ 
    projectId: id || '' 
  });
  const { mutate: deleteMilestone } = useDeleteMilestone();

  // Get materials and labour for this site
  const { data: materials = [], isLoading: materialsLoading } = useMaterials({ 
    projectId: id || '' 
  });
  const { data: labour = [], isLoading: labourLoading } = useLabour({ 
    projectId: id || '' 
  });

  // Site photos hook
  const { photos, stats: photoStats, loading: photosLoading, uploadPhoto, removePhoto } = useSitePhotos(id);

  // Milestone event handlers
  const handleDeleteMilestone = (id: string) => {
    deleteMilestone(id);
  };
  const [newExpense, setNewExpense] = useState({
    name: '',
    description: '',
    amount: '',
    documents: [] as File[]
  });
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [laborDateFilter, setLaborDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = React.useRef<any>(null);

  // Fetch site data on component mount
  useEffect(() => {
    if (id) {
      fetchSiteData();
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    // Fetch chat history from database
    const fetchChatHistory = async () => {
      try {
        const messages = await getChatHistory(id);
        setChatMessages(messages);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error('Failed to load chat history');
      }
    };
    
    fetchChatHistory();
    
    // Connect to websocket
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('joinSite', id);
    socketRef.current.on('chatHistory', (msgs: ChatMessage[]) => setChatMessages(msgs));
    socketRef.current.on('newMessage', (msg: ChatMessage) => setChatMessages(prev => [...prev, msg]));
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  const fetchSiteData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const siteData = await getSiteById(id!);
      setSite(siteData);
      
      // Fetch expenses for this site
      setExpensesLoading(true);
      const siteExpenses = await getSiteExpenses(id!);
      setExpenses(siteExpenses);
    } catch (err) {
      setError('Failed to fetch site data');
      toast.error('Failed to load site details');
      console.error('Error fetching site:', err);
    } finally {
      setIsLoading(false);
      setExpensesLoading(false);
    }
  };

  // Transform API response to match SiteHeader props
  const transformSiteForHeader = (siteData: SiteResponse) => {
    const startDate = new Date(siteData.startDate);
    const endDate = new Date(siteData.endDate);
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysPassed);
    const completionPercentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

    return {
      name: siteData.siteName,
      code: siteData.siteCode,
      address: siteData.address,
      completionPercentage: Math.round(completionPercentage),
      budget: siteData.estimatedBudget,
      utilized: siteData.estimatedBudget * 0.3, // Mock utilized amount
      teamSize: siteData.teamSize,
      managers: Math.ceil(siteData.teamSize * 0.2), // Mock managers count
      admins: Math.ceil(siteData.teamSize * 0.1), // Mock admins count
      totalDays: totalDays,
      daysRemaining: daysRemaining
    };
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expenseData = {
        site: id!,
        name: newExpense.name,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        addedBy: 'Current User',
        date: new Date().toISOString().split('T')[0],
        documents: newExpense.documents
      };
      
      const newExpenseData = await addSiteExpense(expenseData);
      setExpenses([newExpenseData, ...expenses]);
      setNewExpense({
        name: '',
        description: '',
        amount: '',
        documents: []
      });
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewExpense({ ...newExpense, documents: filesArray });
    }
  };

  // Photo upload handler
  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    const photoInput = document.getElementById('photoFile') as HTMLInputElement;
    if (photoInput?.files?.[0]) {
      formData.append('photo', photoInput.files[0]);
      formData.append('siteId', id || '');
      formData.append('siteName', site?.siteName || 'Unknown Site');
      formData.append('description', (document.getElementById('photoDescription') as HTMLTextAreaElement)?.value || '');
      formData.append('category', (document.getElementById('photoCategory') as HTMLSelectElement)?.value || 'General');
      formData.append('uploadedBy', 'Current User');
      
      try {
        await uploadPhoto(formData);
        // Close modal and reset form
        const modal = document.getElementById('uploadPhotoDialog') as HTMLDialogElement;
        const form = document.getElementById('photoUploadForm') as HTMLFormElement;
        const preview = document.getElementById('photoPreview') as HTMLImageElement;
        const fileInfo = document.getElementById('fileInfo') as HTMLDivElement;
        
        if (modal) modal.close();
        if (form) form.reset();
        if (preview) preview.style.display = 'none';
        if (fileInfo) fileInfo.style.display = 'none';
        
        toast.success('Photo uploaded successfully');
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast.error('Failed to upload photo. Please try again.');
      }
    } else {
      toast.error('Please select a photo to upload.');
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && socketRef.current) {
      try {
        const messageData = {
          siteId: id!,
          sender: 'You',
          message: newMessage,
          timestamp: new Date().toISOString(),
          isUser: true
        };
        
        // Save to database first
        const savedMessage = await saveChatMessage(messageData);
        
        // Then emit to socket for real-time updates
        socketRef.current.emit('sendMessage', { siteId: id, message: savedMessage });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
      }
    }
  };

  const handleDownloadDocument = async (expenseId: string, documentIndex: number, originalName: string) => {
    try {
      const blob = await downloadSiteExpenseDocument(expenseId, documentIndex);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const filteredExpenses = Array.isArray(expenses) ? expenses.filter(expense => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true;
    const expenseDate = new Date(expense.date);
    const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
    const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

    return (
      (!startDate || expenseDate >= startDate) &&
      (!endDate || expenseDate <= endDate)
    );
  }) : [];

  const filteredLabor = laborData.filter(labor => {
    if (!laborDateFilter.startDate && !laborDateFilter.endDate) return true;
    const laborDate = new Date(labor.date);
    const startDate = laborDateFilter.startDate ? new Date(laborDateFilter.startDate) : null;
    const endDate = laborDateFilter.endDate ? new Date(laborDateFilter.endDate) : null;

    return (
      (!startDate || laborDate >= startDate) &&
      (!endDate || laborDate <= endDate)
    );
  });

  const filteredSubcontractors = subcontractors.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.scope.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <Header showSiteSelector={false} />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold mb-2">Loading Site...</h1>
              <p className="text-gray-500">Please wait while we fetch the site details.</p>
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
          <Header showSiteSelector={false} />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold mb-2">Error: {error}</h1>
              <p className="text-gray-500">Failed to load site details. Please try again later.</p>
            </div>
          </main>
        </div>
      </MainLayout>
    );
  }

  if (!site) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <Header showSiteSelector={false} />
          <main className="flex-1 overflow-auto p-6">
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-bold mb-2">Site Not Found</h1>
              <p className="text-gray-500">The site you are looking for does not exist.</p>
            </div>
          </main>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <main className="flex-1 overflow-auto p-6 space-y-6">
          <SiteHeader site={transformSiteForHeader(site)} />

          {/* Site Navigation Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'overview'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Site Overview
              {activeTab === 'overview' && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('material')}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'material'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <Box className="mr-2 h-4 w-4" />
              Material & Labour
              {activeTab === 'material' && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'expenses'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              Expenses
              {activeTab === 'expenses' && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'gallery'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <FileImage className="mr-2 h-4 w-4" />
              Gallery
              {activeTab === 'gallery' && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'chat'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
              {activeTab === 'chat' && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('subcontractors')}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center ${activeTab === 'subcontractors'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Subcontractors
              {activeTab === 'subcontractors' && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Project Milestones</h3>
                    <Button onClick={() => setIsAddMilestoneOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Milestone
                    </Button>
                  </div>

                  <MilestoneTable
                    milestones={milestones}
                    onEdit={(milestone) => {
                      setSelectedMilestone(milestone);
                      setIsEditMilestoneOpen(true);
                    }}
                    onDelete={(id) => handleDeleteMilestone(id)}
                    isLoading={milestonesLoading}
                  />

                  <AddMilestoneDialog
                    open={isAddMilestoneOpen}
                    onOpenChange={setIsAddMilestoneOpen}
                    projectId={id || ''}
                  />

                  <EditMilestoneDialog
                    open={isEditMilestoneOpen}
                    onOpenChange={setIsEditMilestoneOpen}
                    milestone={selectedMilestone}
                  />
                </div>
              </div>
            )}

            {activeTab === 'material' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Materials Used</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {materialsLoading ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                              Loading materials...
                            </td>
                          </tr>
                        ) : materials.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                              No materials found
                            </td>
                          </tr>
                        ) : (
                          materials.map((material) => (
                            <tr key={material._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{material.material}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{material.quantity}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{material.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Labour Utilization</h3>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={laborDateFilter.startDate}
                        onChange={(e) => setLaborDateFilter({ ...laborDateFilter, startDate: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Start Date"
                      />
                      <span className="flex items-center">to</span>
                      <input
                        type="date"
                        value={laborDateFilter.endDate}
                        onChange={(e) => setLaborDateFilter({ ...laborDateFilter, endDate: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="End Date"
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">mason</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helper</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supply</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {labourLoading ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              Loading labour data...
                            </td>
                          </tr>
                        ) : labour.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No labour data found
                            </td>
                          </tr>
                        ) : (
                          labour.map((laborEntry) => (
                            <tr key={laborEntry._id}>
                              <td className="px-6 py-4 whitespace-nowrap">{laborEntry.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{laborEntry.mason}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{laborEntry.helper.toLocaleString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{laborEntry.supply}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{laborEntry.date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
                  <form onSubmit={handleAddExpense} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expenseName">Name</Label>
                        <Input
                          id="expenseName"
                          value={newExpense.name}
                          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                          placeholder="Expense name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="expenseAmount">Amount ($)</Label>
                        <Input
                          id="expenseAmount"
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          placeholder="Amount"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="expenseDescription">Description</Label>
                      <Input
                        id="expenseDescription"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        placeholder="Description"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="expenseDocument">Documents (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 border rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-50">
                          <input
                            type="file"
                            id="expenseDocument"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          {newExpense.documents.length > 0 
                            ? `${newExpense.documents.length} file(s) selected` 
                            : "Choose files..."}
                        </label>
                        {newExpense.documents.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setNewExpense({ ...newExpense, documents: [] })}
                          >
                            Remove All
                          </Button>
                        )}
                      </div>
                      {newExpense.documents.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {newExpense.documents.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              <span className="truncate">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0"
                                onClick={() => {
                                  const newFiles = newExpense.documents.filter((_, i) => i !== index);
                                  setNewExpense({ ...newExpense, documents: newFiles });
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Expense Records</h3>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateFilter.startDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Start Date"
                      />
                      <span className="flex items-center">to</span>
                      <input
                        type="date"
                        value={dateFilter.endDate}
                        onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="End Date"
                      />
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    {expensesLoading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Loading expenses...</p>
                      </div>
                    ) : expenses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No expenses found for this site</p>
                      </div>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                                                     <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                           </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                                                     {filteredExpenses.map((expense) => (
                             <tr key={expense._id}>
                               <td className="px-6 py-4 whitespace-nowrap">{expense.name}</td>
                               <td className="px-6 py-4">{expense.description}</td>
                               <td className="px-6 py-4 whitespace-nowrap">${expense.amount.toLocaleString()}</td>
                               <td className="px-6 py-4 whitespace-nowrap">{expense.addedBy}</td>
                               <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                 {expense.documents && expense.documents.length > 0 ? (
                                   <div className="space-y-1">
                                     {expense.documents.map((doc, docIndex) => (
                                       <Button
                                         key={docIndex}
                                         variant="ghost"
                                         size="sm"
                                         onClick={() => handleDownloadDocument(expense._id, docIndex, doc.originalName)}
                                         className="w-full justify-start text-xs"
                                       >
                                         <Download className="mr-1 h-3 w-3" />
                                         {doc.originalName}
                                       </Button>
                                     ))}
                                   </div>
                                 ) : '-'}
                               </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

                         {activeTab === 'gallery' && (
                           <div className="bg-white p-6 rounded-lg shadow">
                             <Gallery siteId={site?._id || ''} siteName={site?.siteName || ''} />
                           </div>
                         )}

            {activeTab === 'chat' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Chat with Subcontractors</h3>
                </div>
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg._id || msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                        {!msg.isUser && <p className="font-medium text-sm">{msg.sender}</p>}
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subcontractors' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Subcontractors</h3>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search subcontractors..."
                        className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredSubcontractors.map((sub) => (
                    <div key={sub.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{sub.name}</h4>
                          <p className="text-sm text-gray-600">{sub.scope}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{sub.contact}</p>
                          <p className="text-sm text-gray-600">{sub.phone}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          <HardHat className="mr-2 h-4 w-4" />
                          View Work
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default SiteDetail;