import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiDollarSign, FiUser, FiBriefcase, FiCalendar, FiPhone, FiMail, FiSave, FiCheck } from 'react-icons/fi';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { EmployeeTable } from '@/components/team/EmployeeTable';
import { useLocation, useParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getTeamMembers, type Employee } from '@/services/teamService';
import { createOrUpdatePayroll, addPayment, getPaymentHistory, getPayrollByEmployee, type PayrollData, type Payment } from '@/services/payrollService';
import { toast } from 'sonner';

type PayrollItem = {
  _id: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  companyCode: string;
  joiningDate: string;
  salary: number;
  advance: number;
  position: string;
  status: 'active' | 'inactive';
  assignedSite?: string[] | string;
  payments: Payment[];
};

// Extended Employee type for Payroll
type PayrollEmployee = Employee & {
  salary: number;
  advance: number;
  payments: Payment[];
};

const Payroll = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<PayrollItem | null>(null);
  const [editForm, setEditForm] = useState({
    salary: 0,
    advance: 0
  });
  const [showAddSalaryDialog, setShowAddSalaryDialog] = useState(false);
  const [showAddAdvanceDialog, setShowAddAdvanceDialog] = useState(false);
  const [salaryForm, setSalaryForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [advanceForm, setAdvanceForm] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto-refresh payment history when editing payroll changes
  useEffect(() => {
    if (editingPayroll && showEditDialog) {
      const refreshPaymentHistory = async () => {
        try {
          console.log('Auto-refreshing payment history for:', editingPayroll._id);
          const freshData = await getPayrollByEmployee(editingPayroll._id);
          if (freshData) {
            setEditingPayroll(prev => prev ? {
              ...prev,
              payments: freshData.payments || []
            } : null);
            console.log('Payment history refreshed:', freshData.payments);
          }
        } catch (error) {
          console.error('Error auto-refreshing payment history:', error);
        }
      };
      
      refreshPaymentHistory();
    }
  }, [showEditDialog, editingPayroll?._id]);

  // Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch employees from Team Management
        let employeesData: Employee[] = [];
        
        try {
          const response = await getTeamMembers();
          console.log('Team Management response:', response);
          
          // Handle different response formats
          if (Array.isArray(response)) {
            employeesData = response;
          } else if (response && Array.isArray(response.data)) {
            employeesData = response.data;
          } else if (response && response.employees && Array.isArray(response.employees)) {
            employeesData = response.employees;
          } else if (response && response.message && response.employees && Array.isArray(response.employees)) {
            employeesData = response.employees;
          } else {
            console.warn('Unexpected response format from Team Management:', response);
            employeesData = [];
          }
        } catch (teamError) {
          console.error('Error fetching from Team Management:', teamError);
          // Fallback to empty array if Team Management fails
          employeesData = [];
        }
        
        setEmployees(employeesData);
        
        // Convert employees to payroll format and load existing payroll data
        const payrollData: PayrollItem[] = await Promise.all(
          employeesData.map(async (emp: Employee) => {
            try {
              // Try to get existing payroll data for this employee
              const existingPayroll = await getPayrollByEmployee(emp._id || '');
              
              return {
                _id: emp._id || '',
                id: Date.now() + Math.random(),
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                companyCode: emp.companyCode || '',
                joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                salary: existingPayroll?.monthlySalary || emp.amount || 0,
                advance: existingPayroll?.totalAdvance || emp.additionalAmount || 0,
                position: emp.position,
                status: (emp.status === 'Active' ? 'active' : 'inactive') as 'active' | 'inactive',
                assignedSite: emp.assignedSite,
                payments: existingPayroll?.payments || []
              };
            } catch (error) {
              console.error(`Error loading payroll for employee ${emp.name}:`, error);
              return {
                _id: emp._id || '',
                id: Date.now() + Math.random(),
                name: emp.name,
                email: emp.email,
                phone: emp.phone,
                companyCode: emp.companyCode || '',
                joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                salary: emp.amount || 0,
                advance: emp.additionalAmount || 0,
                position: emp.position,
                status: (emp.status === 'Active' ? 'active' : 'inactive') as 'active' | 'inactive',
                assignedSite: emp.assignedSite,
                payments: []
              };
            }
          })
        );
        
        setPayrolls(payrollData);
        setLoading(false);
        
        if (employeesData.length === 0) {
          toast.info('No employees found in Team Management. Please add employees there first.');
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to fetch data');
        setLoading(false);
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  // Filter payrolls based on search term and only show active employees
  const filteredPayrolls = payrolls.filter(item => {
    const isActive = item.status === 'active';
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isActive && matchesSearch;
  });

  // Calculate totals
  const totalSalary = filteredPayrolls.reduce((sum, item) => sum + item.salary, 0);
  const totalAdvance = filteredPayrolls.reduce((sum, item) => sum + item.advance, 0);

  // Handle payroll selection - show employee details dialog
  const handlePayrollClick = async (payroll: PayrollItem) => {
    try {
      // Load fresh payroll data from backend
      const freshPayrollData = await getPayrollByEmployee(payroll._id);
      
      if (freshPayrollData) {
        const updatedPayroll = {
          ...payroll,
          salary: freshPayrollData.monthlySalary,
          advance: freshPayrollData.totalAdvance,
          payments: freshPayrollData.payments || []
        };
        
        setEditingPayroll(updatedPayroll);
        setEditForm({
          salary: freshPayrollData.monthlySalary,
          advance: freshPayrollData.totalAdvance
        });
      } else {
        setEditingPayroll(payroll);
        setEditForm({
          salary: payroll.salary,
          advance: payroll.advance
        });
      }
      
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error loading payroll details:', error);
      // Fallback to local data
      setEditingPayroll(payroll);
      setEditForm({
        salary: payroll.salary,
        advance: payroll.advance
      });
      setShowEditDialog(true);
    }
  };

  // Ensure payroll record exists for employee
  const ensurePayrollRecord = async (employeeId: string, employeeData: any) => {
    try {
      console.log('Ensuring payroll record for employee:', employeeId);
      
      // Try to get existing payroll
      let existingPayroll = await getPayrollByEmployee(employeeId);
      console.log('Existing payroll result:', existingPayroll);
      
      if (!existingPayroll) {
        // Create new payroll record if it doesn't exist
        console.log('Creating new payroll record for employee:', employeeId);
        console.log('Employee data for payroll creation:', employeeData);
        
        existingPayroll = await createOrUpdatePayroll({
          employeeId: employeeId,
          monthlySalary: employeeData.salary || employeeData.amount || 0,
          totalAdvance: employeeData.advance || employeeData.additionalAmount || 0
        });
        
        console.log('Created payroll record:', existingPayroll);
      }
      
      return existingPayroll;
    } catch (error) {
      console.error('Error ensuring payroll record:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      return null;
    }
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch('/api/payroll');
      console.log('Backend test response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend test data:', data);
        return true;
      } else {
        console.error('Backend test failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Backend test error:', error);
      return false;
    }
  };

  // Refresh payroll data for a specific employee
  const refreshPayrollData = async (employeeId: string) => {
    try {
      console.log('Refreshing payroll data for employee:', employeeId);
      const freshData = await getPayrollByEmployee(employeeId);
      
      if (freshData) {
        // Update payrolls state
        setPayrolls(prev => prev.map(p => 
          p._id === employeeId 
            ? {
                ...p,
                salary: freshData.monthlySalary,
                advance: freshData.totalAdvance,
                payments: freshData.payments || []
              }
            : p
        ));

        // Update editing payroll state if it's the same employee
        setEditingPayroll(prev => 
          prev && prev._id === employeeId 
            ? {
                ...prev,
                salary: freshData.monthlySalary,
                advance: freshData.totalAdvance,
                payments: freshData.payments || []
              }
            : prev
        );

        console.log('Payroll data refreshed successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing payroll data:', error);
      return false;
    }
  };

  // Handle add salary payment
  const handleAddSalaryPayment = () => {
    setSalaryForm({
      amount: editingPayroll?.salary || 0,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddSalaryDialog(true);
  };

  // Handle add advance payment
  const handleAddAdvancePayment = () => {
    setAdvanceForm({
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddAdvanceDialog(true);
  };

  // Handle save salary payment
  const handleSaveSalaryPayment = async () => {
    if (editingPayroll && salaryForm.amount > 0) {
      try {
        setIsUpdating(true);
        console.log('=== SALARY PAYMENT DEBUG ===');
        console.log('Employee ID:', editingPayroll._id);
        console.log('Employee Name:', editingPayroll.name);
        console.log('Salary form data:', salaryForm);
        
        // Test backend connection first
        console.log('Testing backend connection...');
        const backendConnected = await testBackendConnection();
        if (!backendConnected) {
          toast.error('Backend connection failed. Please check if server is running.');
          return;
        }
        console.log('Backend connection successful');
        
        // First ensure payroll record exists
        console.log('Ensuring payroll record exists...');
        const payrollRecord = await ensurePayrollRecord(editingPayroll._id, editingPayroll);
        console.log('Payroll record result:', payrollRecord);
        
        if (!payrollRecord) {
          toast.error('Failed to create payroll record');
          return;
        }
        
        // Add payment to backend
        console.log('Adding salary payment to backend...');
        const result = await addPayment(editingPayroll._id, {
          amount: salaryForm.amount,
          type: 'salary',
          notes: salaryForm.notes,
          date: salaryForm.date
        });

        console.log('Add payment result:', result);

        if (result) {
          console.log('Payment added successfully, updating local state...');
          console.log('Result payments:', result.payments);
          
          // Update local state with new payment data
          setPayrolls(prev => prev.map(p => 
            p._id === editingPayroll._id 
              ? { 
                  ...p, 
                  payments: result.payments || [],
                  salary: result.monthlySalary || p.salary // Update salary from backend response
                }
              : p
          ));

          // Update editing payroll state with fresh data
          setEditingPayroll(prev => prev ? { 
            ...prev, 
            payments: result.payments || [],
            salary: result.monthlySalary || prev.salary // Update salary from backend response
          } : null);

          setShowAddSalaryDialog(false);
          toast.success('Salary payment added successfully');
          
          // Force a small delay to ensure state updates are processed
          setTimeout(() => {
            console.log('Current editing payroll state after update:', editingPayroll);
          }, 100);
          
          // Refresh the payroll data to ensure consistency
          console.log('Refreshing payroll data after salary payment...');
          const refreshSuccess = await refreshPayrollData(editingPayroll._id);
          console.log('Refresh success:', refreshSuccess);
          
          // Force refresh payment history in the dialog
          if (showEditDialog) {
            console.log('Forcing payment history refresh in dialog...');
            const freshData = await getPayrollByEmployee(editingPayroll._id);
            if (freshData) {
              setEditingPayroll(prev => prev ? {
                ...prev,
                payments: freshData.payments || [],
                salary: freshData.monthlySalary || prev.salary // Update salary from fresh data
              } : null);
              console.log('Dialog payment history updated:', freshData.payments);
              console.log('Dialog salary updated:', freshData.monthlySalary);
            }
          }
        } else {
          console.error('No result from addPayment API');
          toast.error('Failed to add salary payment - no response from server');
        }
      } catch (error) {
        console.error('=== SALARY PAYMENT ERROR ===');
        console.error('Error adding salary payment:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        toast.error('Failed to add salary payment');
      } finally {
        setIsUpdating(false);
      }
    } else {
      console.log('Invalid data for salary payment:', { editingPayroll, salaryForm });
      toast.error('Please enter a valid amount');
    }
  };

  // Handle save advance payment
  const handleSaveAdvancePayment = async () => {
    if (editingPayroll && advanceForm.amount > 0) {
      try {
        setIsUpdating(true);
        console.log('=== ADVANCE PAYMENT DEBUG ===');
        console.log('Employee ID:', editingPayroll._id);
        console.log('Employee Name:', editingPayroll.name);
        console.log('Advance form data:', advanceForm);
        
        // Test backend connection first
        console.log('Testing backend connection...');
        const backendConnected = await testBackendConnection();
        if (!backendConnected) {
          toast.error('Backend connection failed. Please check if server is running.');
          return;
        }
        console.log('Backend connection successful');
        
        // First ensure payroll record exists
        console.log('Ensuring payroll record exists...');
        const payrollRecord = await ensurePayrollRecord(editingPayroll._id, editingPayroll);
        console.log('Payroll record result:', payrollRecord);
        
        if (!payrollRecord) {
          toast.error('Failed to create payroll record');
          return;
        }
        
        // Add payment to backend - backend will automatically update totalAdvance
        console.log('Adding advance payment to backend...');
        const result = await addPayment(editingPayroll._id, {
          amount: advanceForm.amount,
          type: 'advance',
          notes: advanceForm.notes,
          date: advanceForm.date
        });

        console.log('Add payment result:', result);

        if (result) {
          console.log('Payment added successfully, updating local state...');
          
          // Update local state with new payment data and updated totalAdvance from backend
          setPayrolls(prev => prev.map(p => 
            p._id === editingPayroll._id 
              ? { 
                  ...p, 
                  payments: result.payments, 
                  advance: result.totalAdvance // Use backend calculated value
                }
              : p
          ));

          // Update editing payroll state
          setEditingPayroll(prev => prev ? { 
            ...prev, 
            payments: result.payments, 
            advance: result.totalAdvance // Use backend calculated value
          } : null);

          setShowAddAdvanceDialog(false);
          toast.success('Advance payment added successfully');
          
          // Refresh the payroll data to ensure consistency
          console.log('Refreshing payroll data after advance payment...');
          const refreshSuccess = await refreshPayrollData(editingPayroll._id);
          console.log('Refresh success:', refreshSuccess);
          
          // Force refresh payment history in the dialog
          if (showEditDialog) {
            console.log('Forcing payment history refresh in dialog...');
            const freshData = await getPayrollByEmployee(editingPayroll._id);
            if (freshData) {
              setEditingPayroll(prev => prev ? {
                ...prev,
                payments: freshData.payments || [],
                advance: freshData.totalAdvance
              } : null);
              console.log('Dialog payment history updated:', freshData.payments);
            }
          }
        } else {
          console.error('No result from addPayment API');
          toast.error('Failed to add advance payment - no response from server');
        }
      } catch (error) {
        console.error('=== ADVANCE PAYMENT ERROR ===');
        console.error('Error adding advance payment:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        toast.error('Failed to add advance payment');
      } finally {
        setIsUpdating(false);
      }
    } else {
      console.log('Invalid data for advance payment:', { editingPayroll, advanceForm });
      toast.error('Please enter a valid amount');
    }
  };

  // Handle edit payroll
  const handleEditPayroll = async (payroll: PayrollItem) => {
    try {
      // Load fresh payroll data from backend
      const freshPayrollData = await getPayrollByEmployee(payroll._id);
      
      if (freshPayrollData) {
        const updatedPayroll = {
          ...payroll,
          salary: freshPayrollData.monthlySalary,
          advance: freshPayrollData.totalAdvance,
          payments: freshPayrollData.payments || []
        };
        
        setEditingPayroll(updatedPayroll);
        setEditForm({
          salary: freshPayrollData.monthlySalary,
          advance: freshPayrollData.totalAdvance
        });
      } else {
        setEditingPayroll(payroll);
        setEditForm({
          salary: payroll.salary,
          advance: payroll.advance
        });
      }
      
      setShowEditDialog(true);
    } catch (error) {
      console.error('Error loading payroll for edit:', error);
      // Fallback to local data
      setEditingPayroll(payroll);
      setEditForm({
        salary: payroll.salary,
        advance: payroll.advance
      });
      setShowEditDialog(true);
    }
  };

  // Handle save edit - Updated to work with backend
  const handleSaveEdit = async () => {
    if (editingPayroll) {
      try {
        setIsUpdating(true);
        console.log('Saving edit for employee:', editingPayroll._id);
        console.log('Edit form data:', editForm);
        
        // Update backend with new salary and advance values
        const result = await createOrUpdatePayroll({
          employeeId: editingPayroll._id,
          monthlySalary: editForm.salary,
          totalAdvance: editForm.advance
        });

        console.log('Backend update result:', result);

        if (result) {
          // Update local state with backend response data
          setPayrolls(prev => prev.map(p => 
            p._id === editingPayroll._id 
              ? { 
                  ...p, 
                  salary: result.monthlySalary, 
                  advance: result.totalAdvance 
                }
              : p
          ));

          // Update editing payroll state with backend response data
          setEditingPayroll(prev => prev ? { 
            ...prev, 
            salary: result.monthlySalary, 
            advance: result.totalAdvance 
          } : null);

          setShowEditDialog(false);
          toast.success('Payroll updated successfully');
          
          // Refresh the data to ensure consistency
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.error('Failed to update payroll - no response from server');
        }
      } catch (error) {
        console.error('Error updating payroll:', error);
        toast.error('Failed to update payroll');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg mb-2">Loading employees from Team Management...</div>
            <div className="text-sm text-gray-500">Syncing payroll data</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
                 <Header
           title="Payroll Management"
           showSiteSelector={false}
         />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
             {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Payroll Management</h1>
                  <p className="text-gray-500">Manage employee payroll and payments</p>
                </div>
              </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <FiUser className="text-blue-600 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Employees</p>
                    <p className="text-xl font-bold">{filteredPayrolls.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <FiDollarSign className="text-green-600 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Salary</p>
                    <p className="text-xl font-bold">₹{totalSalary.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <FiDollarSign className="text-red-600 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Total Advance</p>
                    <p className="text-xl font-bold">₹{totalAdvance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <FiBriefcase className="text-purple-600 text-2xl mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Active Employees</p>
                    <p className="text-xl font-bold">{filteredPayrolls.filter(p => p.status === 'active').length}</p>
                  </div>
                </div>
              </div>
            </div>

            

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-grow w-full sm:w-auto">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search employees by name, position, or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                Showing {filteredPayrolls.length} of {payrolls.length} employees
              </div>
            </div>

                         {/* Payroll Table */}
             <div className="bg-white rounded-lg shadow overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="min-w-full">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Employee
                       </th>
                       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Contact
                       </th>
                       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Position
                       </th>
                       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Salary
                       </th>
                       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Advance
                       </th>
                       <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Join Date
                       </th>
                                               <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredPayrolls.length === 0 ? (
                       <tr>
                         <td colSpan={8} className="px-3 sm:px-6 py-12 text-center">
                           <div className="flex flex-col items-center">
                             <FiUser className="text-gray-400 text-4xl mb-4" />
                             <h3 className="text-lg font-medium text-gray-900 mb-2">
                               No employees found
                             </h3>
                                                           <p className="text-gray-500 mb-4 text-center">
                                {payrolls.length === 0 
                                  ? "No active employees found."
                                  : "No active employees match your search criteria."
                                }
                              </p>
                           </div>
                         </td>
                       </tr>
                     ) : (
                       filteredPayrolls.map((payroll) => (
                         <tr key={payroll._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handlePayrollClick(payroll)}>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                             <div>
                               <div className="text-sm font-medium text-gray-900">
                                 {payroll.name}
                               </div>
                               <div className="text-sm text-gray-500">
                                 {payroll.companyCode}
                               </div>
                             </div>
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                             <div>
                               <div className="text-sm text-gray-900">
                                 {payroll.email}
                               </div>
                               <div className="text-sm text-gray-500">
                                 {payroll.phone}
                               </div>
                             </div>
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {payroll.position}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             ₹{payroll.salary.toLocaleString()}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             ₹{payroll.advance.toLocaleString()}
                           </td>
                           <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                             {new Date(payroll.joiningDate).toLocaleDateString()}
                           </td>
                                                       <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  payroll.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleEditPayroll(payroll); 
                                }}
                              >
                                <FiEdit2 className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                            </td>
                          </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
          </motion.div>
        </main>
      </div>

      

                                    {/* Employee Details Dialog - Responsive */}
         <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
           <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-white">
             <DialogHeader>
               <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">Employee Details</DialogTitle>
             </DialogHeader>

             {editingPayroll && (
               <div className="space-y-6">
                 {/* Basic Information and Financial Details - Responsive Grid */}
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                   {/* Basic Information */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                     <div className="space-y-3">
                       <div>
                         <Label className="text-sm font-medium text-gray-600">Name</Label>
                         <p className="text-lg font-semibold text-gray-900">{editingPayroll.name}</p>
                       </div>
                       <div>
                         <Label className="text-sm font-medium text-gray-600">Designation</Label>
                         <p className="text-lg font-semibold text-gray-900">{editingPayroll.position}</p>
                       </div>
                       <div>
                         <Label className="text-sm font-medium text-gray-600">Join Date</Label>
                         <p className="text-lg font-semibold text-gray-900">{new Date(editingPayroll.joiningDate).toLocaleDateString()}</p>
                       </div>
                       <div>
                         <Label className="text-sm font-medium text-gray-600">Status</Label>
                         <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                           editingPayroll.status === 'active' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-red-100 text-red-800'
                         }`}>
                           {editingPayroll.status.charAt(0).toUpperCase() + editingPayroll.status.slice(1)}
                         </span>
                       </div>
                     </div>
                   </div>

                   {/* Financial Details */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold text-gray-800">Financial Details</h3>
                     <div className="space-y-3">
                       <div>
                         <Label className="text-sm font-medium text-gray-600">Monthly Salary</Label>
                         <p className="text-2xl font-bold text-gray-900">₹{editingPayroll.salary.toLocaleString()}</p>
                       </div>
                       <div>
                         <Label className="text-sm font-medium text-gray-600">Total Advance</Label>
                         <p className="text-2xl font-bold text-gray-900">₹{editingPayroll.advance.toLocaleString()}</p>
                       </div>
                       
                       {/* Payment Buttons */}
                       <div className="space-y-2 pt-4">
                         <Button 
                           onClick={handleAddSalaryPayment}
                           className="w-full bg-green-600 hover:bg-green-700 text-white"
                           disabled={isUpdating}
                         >
                           <FiDollarSign className="w-4 h-4 mr-2" />
                           Add Salary Payment
                         </Button>
                         <Button 
                           onClick={handleAddAdvancePayment}
                           className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                           disabled={isUpdating}
                         >
                           <FiDollarSign className="w-4 h-4 mr-2" />
                           Add Advance
                         </Button>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Payment History */}
                 <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-gray-800">Payment History</h3>
                   <div className="bg-gray-50 rounded-lg overflow-hidden">
                     <div className="overflow-x-auto">
                       <table className="min-w-full">
                         <thead className="bg-gray-100">
                           <tr>
                             <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                             <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                             <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT (₹)</th>
                             <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NOTES</th>
                           </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                           {editingPayroll.payments.length === 0 ? (
                             <tr>
                               <td colSpan={4} className="px-3 sm:px-4 py-8 text-center text-gray-500">
                                 No payment history available
                               </td>
                             </tr>
                           ) : (
                                                       editingPayroll.payments.map((payment) => (
                              <tr key={payment._id || Math.random()}>
                                <td className="px-3 sm:px-4 py-3 text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="px-3 sm:px-4 py-3 text-sm text-gray-900 capitalize">{payment.type}</td>
                                <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString()}</td>
                                <td className="px-3 sm:px-4 py-3 text-sm text-gray-900">{payment.notes}</td>
                              </tr>
                            ))
                           )}
                         </tbody>
                       </table>
                     </div>
                   </div>
                 </div>

                                   {/* Close Button */}
                  <div className="text-right">
                    <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Add Salary Payment Dialog - Responsive */}
          <Dialog open={showAddSalaryDialog} onOpenChange={setShowAddSalaryDialog}>
            <DialogContent className="max-w-md w-[95vw] bg-gradient-to-br from-green-50 to-emerald-100">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Add Salary Payment</DialogTitle>
                <DialogDescription>
                  Add a new salary payment for {editingPayroll?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                <div>
                  <Label htmlFor="salary-amount">Amount (₹)</Label>
                  <Input
                    id="salary-amount"
                    type="number"
                    value={salaryForm.amount}
                    onChange={(e) => setSalaryForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="Enter salary amount"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salary-date">Payment Date</Label>
                  <Input
                    id="salary-date"
                    type="date"
                    value={salaryForm.date}
                    onChange={(e) => setSalaryForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salary-notes">Notes</Label>
                  <Input
                    id="salary-notes"
                    value={salaryForm.notes}
                    onChange={(e) => setSalaryForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g., Monthly salary June"
                    className="w-full"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddSalaryDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveSalaryPayment} 
                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4 mr-2" />
                        Add Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Advance Payment Dialog - Responsive */}
          <Dialog open={showAddAdvanceDialog} onOpenChange={setShowAddAdvanceDialog}>
            <DialogContent className="max-w-md w-[95vw] bg-gradient-to-br from-blue-50 to-indigo-100">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Add Advance Payment</DialogTitle>
                <DialogDescription>
                  Add a new advance payment for {editingPayroll?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
                <div>
                  <Label htmlFor="advance-amount">Amount (₹)</Label>
                  <Input
                    id="advance-amount"
                    type="number"
                    value={advanceForm.amount}
                    onChange={(e) => setAdvanceForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="Enter advance amount"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="advance-date">Payment Date</Label>
                  <Input
                    id="advance-date"
                    type="date"
                    value={advanceForm.date}
                    onChange={(e) => setAdvanceForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="advance-notes">Notes</Label>
                  <Input
                    id="advance-notes"
                    value={advanceForm.notes}
                    onChange={(e) => setAdvanceForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="e.g., Medical emergency"
                    className="w-full"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddAdvanceDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveAdvancePayment} 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4 mr-2" />
                        Add Payment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
    </MainLayout>
  );
};

export default Payroll;