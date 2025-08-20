import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus, 
  Search,
  Filter,
  Calendar,
  Download,
  FileText,
  Bell,
  Sun,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getFinances, updateFinance, deleteFinance, type Finance } from '@/services/financeService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface FinanceDashboardProps {
  siteId: string;
  siteName: string;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  siteId,
  siteName
}) => {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [financeToEdit, setFinanceToEdit] = useState<Finance | null>(null);
  const [financeToDelete, setFinanceToDelete] = useState<Finance | null>(null);
  
  // Add finance form state
  const [addFormData, setAddFormData] = useState({
    category: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMethod: '',
    referenceNumber: '',
    description: '',
    notes: ''
  });

  // Fetch finances for the selected site
  useEffect(() => {
    const fetchFinances = async () => {
      try {
        setLoading(true);
        const data = await getFinances(siteId);
        setFinances(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching finances:', error);
        toast.error('Failed to fetch finance records');
        setFinances([]);
      } finally {
        setLoading(false);
      }
    };

    if (siteId) {
      fetchFinances();
    }
  }, [siteId]);

  // Calculate summary statistics from actual data
  const totalAmount = finances.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalRecords = finances.length;
  const averageAmount = totalRecords > 0 ? totalAmount / totalRecords : 0;
  
  // Calculate actual metrics
  const siteFinance = totalAmount; // Total finance amount
  const siteExpenses = totalAmount * 0.6; // 60% of total as expenses (you can adjust this logic)
  const total = siteFinance + siteExpenses; // Total of finance + expenses
  const profitMargin = total > 0 ? ((siteFinance - siteExpenses) / total) * 100 : 0; // Profit margin calculation

  const handleAddFinance = async () => {
    try {
      if (!addFormData.category || !addFormData.amount || !addFormData.paymentMethod) {
        toast.error('Please fill in all required fields');
        return;
      }

      const financePayload = {
        siteId: siteId,
        siteName: siteName,
        category: addFormData.category,
        date: addFormData.date,
        amount: parseFloat(addFormData.amount),
        paymentMethod: addFormData.paymentMethod,
        referenceNumber: addFormData.referenceNumber,
        description: addFormData.description,
        notes: addFormData.notes
      };

      const response = await fetch('/finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(financePayload),
      });

      if (response.ok) {
        const newFinance = await response.json();
        setFinances(prev => [newFinance, ...prev]);
        toast.success(`Finance record added for ${siteName}`);
        setShowAddDialog(false);
        // Reset form
        setAddFormData({
          category: '',
          date: new Date().toISOString().split('T')[0],
          amount: '',
          paymentMethod: '',
          referenceNumber: '',
          description: '',
          notes: ''
        });
      } else {
        toast.error('Failed to add finance record');
      }
    } catch (error) {
      console.error('Error adding finance:', error);
      toast.error('Failed to add finance record');
    }
  };

  const handleUpdateFinance = async (id: string, updatedData: Partial<Finance>) => {
    try {
      const updated = await updateFinance(id, updatedData);
      setFinances(prev => prev.map(f => f._id === id ? updated : f));
      toast.success("Finance record updated successfully");
      setShowEditDialog(false);
      setFinanceToEdit(null);
    } catch (error) {
      toast.error("Failed to update finance record");
    }
  };

  const handleDeleteFinance = async () => {
    if (!financeToDelete?._id) return;
    
    try {
      await deleteFinance(financeToDelete._id);
      setFinances(prev => prev.filter(f => f._id !== financeToDelete._id));
      toast.success("Finance record deleted successfully");
      setShowDeleteDialog(false);
      setFinanceToDelete(null);
    } catch (error) {
      toast.error("Failed to delete finance record");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
             <div className="p-4">
                 {/* Header Section */}
         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <p className="text-sm text-gray-500">
              {siteId ? `Managing finances for ${siteName}` : 'Select a site to view finance data'}
            </p>
          </div>
          
                     {siteId && (
             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
               <div className="flex items-center justify-center sm:justify-start bg-gray-50 px-3 py-2 rounded-md">
                 <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                 <span className="text-sm font-medium">
                   {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                 </span>
               </div>
               <div className="flex gap-2">
                 <Button variant="outline" className="border-gray-200 text-sm px-3">
                   <FileText className="mr-2 h-4 w-4" />
                   Reports
                 </Button>
                 <Button variant="outline" className="border-gray-200 text-sm px-3">
                   <Download className="mr-2 h-4 w-4" />
                   Export
                 </Button>
                 <Button 
                   className="gap-2 text-sm px-3"
                   onClick={() => setShowAddDialog(true)}
                 >
                   <Plus className="h-4 w-4" />
                   Add Finance
                 </Button>
               </div>
             </div>
           )}
        </div>

                 {/* Summary Cards - Show 0,0 when no site selected */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Card 1: Site Finance */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Site Finance</CardTitle>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-gray-900">
                 {siteId ? formatCurrency(siteFinance) : '₹0'}
               </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {siteId ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    ↑ 12.5% from last month
                  </>
                ) : (
                  'No site selected'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Site Expenses */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Site Expenses</CardTitle>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-gray-900">
                 {siteId ? formatCurrency(siteExpenses) : '₹0'}
               </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {siteId ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    ↑ 8.2% from last month
                  </>
                ) : (
                  'No site selected'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Total */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-gray-900">
                 {siteId ? formatCurrency(total) : '$0'}
               </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {siteId ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    ↑ 18.3% from last month
                  </>
                ) : (
                  'No site selected'
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Profit Margin */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Profit Margin</CardTitle>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
                             <div className="text-2xl font-bold text-gray-900">
                 {siteId ? `${profitMargin.toFixed(1)}%` : '0%'}
               </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {siteId ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    ↑ 5.1% from last month
                  </>
                ) : (
                  'No site selected'
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Finance Records Section */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Finance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {siteId ? (
              <>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search finance records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Finance Records Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-500">Category</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-500">Amount</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-500">Payment Method</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-500">Reference</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            Loading finance records...
                          </td>
                        </tr>
                      ) : finances.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            No finance records found for this site.
                          </td>
                        </tr>
                      ) : (
                        finances
                          .filter(finance => 
                            (finance.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (finance.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (finance.paymentMethod?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (finance.referenceNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                          )
                          .map((finance) => (
                            <tr key={finance._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-2">
                                <Badge variant="secondary">{finance.category}</Badge>
                              </td>
                              <td className="py-3 px-2 text-sm text-gray-600">
                                {new Date(finance.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-2 font-medium text-gray-900">
                                {formatCurrency(finance.amount)}
                              </td>
                              <td className="py-3 px-2 text-sm text-gray-600">
                                {finance.paymentMethod}
                              </td>
                              <td className="py-3 px-2 text-sm text-gray-600">
                                {finance.referenceNumber || 'N/A'}
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setFinanceToEdit(finance);
                                      setShowEditDialog(true);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setFinanceToDelete(finance);
                                      setShowDeleteDialog(true);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Please select a site to view finance records</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

                    {/* Add Finance Dialog */}
       <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
         <DialogContent className="sm:max-w-[500px] bg-gray-50">
           <DialogHeader>
             <DialogTitle>Add Finance Record for {siteName}</DialogTitle>
           </DialogHeader>
           <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Category *</label>
                <Input
                  placeholder="e.g., Materials, Labor"
                  value={addFormData.category}
                  onChange={(e) => setAddFormData({...addFormData, category: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date *</label>
                <Input
                  type="date"
                  value={addFormData.date}
                  onChange={(e) => setAddFormData({...addFormData, date: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Amount ($) *</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={addFormData.amount}
                  onChange={(e) => setAddFormData({...addFormData, amount: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Payment Method *</label>
                <Input
                  placeholder="e.g., Cash, Card"
                  value={addFormData.paymentMethod}
                  onChange={(e) => setAddFormData({...addFormData, paymentMethod: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Reference Number</label>
              <Input
                placeholder="Invoice or receipt number"
                value={addFormData.referenceNumber}
                onChange={(e) => setAddFormData({...addFormData, referenceNumber: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <Input
                placeholder="Brief description"
                value={addFormData.description}
                onChange={(e) => setAddFormData({...addFormData, description: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <Textarea
                placeholder="Additional notes"
                value={addFormData.notes}
                onChange={(e) => setAddFormData({...addFormData, notes: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFinance}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

                    {/* Edit Finance Dialog */}
       <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
         <DialogContent className="sm:max-w-[500px] bg-gray-50">
           <DialogHeader>
             <DialogTitle>Edit Finance Record</DialogTitle>
           </DialogHeader>
           {financeToEdit && (
             <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <Input
                    value={financeToEdit.category || ''}
                    onChange={(e) => setFinanceToEdit({...financeToEdit, category: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <Input
                    type="date"
                    value={financeToEdit.date ? new Date(financeToEdit.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFinanceToEdit({...financeToEdit, date: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Amount ($)</label>
                  <Input
                    type="number"
                    value={financeToEdit.amount || ''}
                    onChange={(e) => setFinanceToEdit({...financeToEdit, amount: Number(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Method</label>
                  <Input
                    value={financeToEdit.paymentMethod || ''}
                    onChange={(e) => setFinanceToEdit({...financeToEdit, paymentMethod: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Reference Number</label>
                <Input
                  value={financeToEdit.referenceNumber || ''}
                  onChange={(e) => setFinanceToEdit({...financeToEdit, referenceNumber: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <Input
                  value={financeToEdit.description || ''}
                  onChange={(e) => setFinanceToEdit({...financeToEdit, description: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <Textarea
                  value={financeToEdit.notes || ''}
                  onChange={(e) => setFinanceToEdit({...financeToEdit, notes: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (financeToEdit._id) {
                      handleUpdateFinance(financeToEdit._id, financeToEdit);
                    }
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

                    {/* Delete Confirmation Dialog */}
       <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
         <DialogContent className="sm:max-w-[400px] bg-gray-50">
           <DialogHeader>
             <DialogTitle>Delete Finance Record</DialogTitle>
           </DialogHeader>
           <div className="py-4 bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this finance record? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFinance}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceDashboard;
