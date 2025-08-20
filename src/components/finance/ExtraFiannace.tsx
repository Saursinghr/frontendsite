import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiDownload, FiX, FiSave, FiDollarSign, FiUser } from 'react-icons/fi';
import { Button } from '../ui/button';
import {
  getExtraFinances,
  addExtraFinance,
  updateExtraFinance,
  deleteExtraFinance,
  addPaymentLog,
} from '@/services/financeService';
import type { ExtraFinance } from '@/services/financeService';
import { getAllSites } from '@/services/siteService';

const ExtraFinance = () => {
  const [transactions, setTransactions] = useState<ExtraFinance[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [newTransaction, setNewTransaction] = useState<Omit<ExtraFinance, '_id'>>({
    siteId: '',
    date: new Date().toISOString().split('T')[0],
    name: '',
    transferred: 0,
    received: 0,
    remaining: 0,
    percentage: 0,
    receivableAmount: 0,
  });
  const [editCache, setEditCache] = useState<Partial<ExtraFinance>>({});
  const [showPaymentLog, setShowPaymentLog] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    paidBy: '',
    notes: '',
    dateTime: ''
  });

  useEffect(() => {
    getExtraFinances().then(setTransactions);
    getAllSites().then(setSites);
  }, []);

  // Calculate receivable amount when transferred or percentage changes
  useEffect(() => {
    const percentageCut = newTransaction.percentage || 0;
    const receivableAmount = newTransaction.transferred - (newTransaction.transferred * percentageCut / 100);
    setNewTransaction(prev => ({
      ...prev,
      receivableAmount: receivableAmount
    }));
  }, [newTransaction.transferred, newTransaction.percentage]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTransferred = filteredTransactions.reduce((sum, item) => sum + item.transferred, 0);
  const totalReceivable = filteredTransactions.reduce((sum, item) => sum + (item.receivableAmount || 0), 0);
  const totalReceived = filteredTransactions.reduce((sum, item) => sum + item.received, 0);
  const totalRemaining = filteredTransactions.reduce((sum, item) => sum + item.remaining, 0);
  const receivedPercentage = totalReceivable > 0 ? (totalReceived / totalReceivable) * 100 : 0;

  const handleAddTransaction = async () => {
    // Calculate receivable amount based on percentage cut
    const percentageCut = newTransaction.percentage || 0;
    const receivableAmount = newTransaction.transferred - (newTransaction.transferred * percentageCut / 100);
    const remaining = receivableAmount - newTransaction.received;
    
    try {
      const transactionData = {
        ...newTransaction,
        receivableAmount,
        remaining,
        paidBy: newPayment.paidBy || 'Unknown',
        notes: newPayment.notes
      };

      const created = await addExtraFinance(transactionData);
      setTransactions([...transactions, created]);
      setNewTransaction({
        siteId: '',
        date: new Date().toISOString().split('T')[0],
        name: '',
        transferred: 0,
        received: 0,
        remaining: 0,
        percentage: 0,
        receivableAmount: 0,
      });
      setNewPayment({ amount: 0, paidBy: '', notes: '', dateTime: '' });
      setIsAdding(false);
    } catch (err) {
      alert('Failed to add transaction');
    }
  };

  const handleAddPayment = async (transactionId: string) => {
    try {
      const paymentData = {
        amount: newPayment.amount,
        paidBy: newPayment.paidBy,
        notes: newPayment.notes,
        date: newPayment.dateTime ? new Date(newPayment.dateTime) : new Date()
      };
      const updated = await addPaymentLog(transactionId, paymentData);
      setTransactions(transactions.map(t => (t._id === transactionId ? updated : t)));
      setNewPayment({ amount: 0, paidBy: '', notes: '', dateTime: '' });
      setShowPaymentLog(null);
    } catch (err) {
      alert('Failed to add payment');
    }
  };

  const handleEditTransaction = (id: string, field: keyof ExtraFinance, value: any) => {
    setTransactions(transactions.map(t => {
      if (t._id === id) {
        const updated = { ...t, [field]: value };
        
        // Recalculate receivable and remaining when transferred or percentage changes
        if (field === 'transferred' || field === 'percentage') {
          const percentageCut = updated.percentage || 0;
          updated.receivableAmount = updated.transferred - (updated.transferred * percentageCut / 100);
          updated.remaining = updated.receivableAmount - (updated.received || 0);
        } else if (field === 'received') {
          updated.remaining = (updated.receivableAmount || 0) - (updated.received || 0);
        }
        
        setEditCache(updated);
        return updated;
      }
      return t;
    }));
  };

  const saveEditTransaction = async (id: string) => {
    const toUpdate = transactions.find(t => t._id === id);
    if (!toUpdate) return;
    try {
      const updated = await updateExtraFinance(id, toUpdate);
      setTransactions(transactions.map(t => (t._id === id ? updated : t)));
      setEditingId(null);
      setEditCache({});
    } catch (err) {
      alert('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteExtraFinance(id);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to delete transaction');
    }
  };

  const startEditing = (id: string) => {
    setEditingId(id);
    const t = transactions.find(t => t._id === id);
    setEditCache(t || {});
  };

  const stopEditing = () => {
    setEditingId(null);
    setEditCache({});
  };

  const getSiteName = (siteId: string) => {
    const site = sites.find(s => s._id === siteId);
    return site ? site.siteName : 'Unknown Site';
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        <Header title="Extra Finance Tracking" />
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Financial Transactions</h1>
              <p className="text-gray-600">Track all extra project expenses</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FiDownload /> Export
              </Button>

              <Button 
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                onClick={() => setIsAdding(true)}
              >
                <FiPlus /> Add Transaction
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Amount Transferred</h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalTransferred.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Amount Receivable</h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalReceivable.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Amount Received</h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalReceived.toLocaleString()} ({receivedPercentage.toFixed(1)}%)
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="text-gray-500 text-sm font-medium">Amount Remaining</h3>
              <p className="text-2xl font-bold text-gray-800">₹{totalRemaining.toLocaleString()}</p>
            </div>
          </div>

          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-lg border border-blue-200 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site</label>
                  <select
                    className="w-full p-3 border-2 border-blue-200 rounded-lg bg-white hover:border-blue-300 focus:border-blue-500 transition-colors"
                    value={newTransaction.siteId}
                    onChange={(e) => setNewTransaction({...newTransaction, siteId: e.target.value})}
                  >
                    <option value="">Select a site</option>
                    {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                        {site.siteName} ({site.siteCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border-2 border-purple-200 rounded-lg bg-white hover:border-purple-300 focus:border-purple-500 transition-colors"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-teal-200 rounded-lg bg-white hover:border-teal-300 focus:border-teal-500 transition-colors"
                    value={newTransaction.name}
                    onChange={(e) => setNewTransaction({...newTransaction, name: e.target.value})}
                    placeholder="Transaction name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transferred (₹)</label>
                  <input
                    type="number"
                    className="w-full p-3 border-2 border-orange-200 rounded-lg bg-white hover:border-orange-300 focus:border-orange-500 transition-colors"
                    value={newTransaction.transferred}
                    onChange={(e) => setNewTransaction({...newTransaction, transferred: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percentage Cut (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full p-3 border-2 border-yellow-200 rounded-lg bg-white hover:border-yellow-300 focus:border-yellow-500 transition-colors"
                    value={newTransaction.percentage}
                    onChange={(e) => setNewTransaction({...newTransaction, percentage: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receivable Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full p-3 border-2 border-pink-200 rounded-lg bg-white hover:border-pink-300 focus:border-pink-500 transition-colors"
                    value={newTransaction.receivableAmount}
                    onChange={(e) => setNewTransaction({...newTransaction, receivableAmount: Number(e.target.value)})}
                    readOnly
                    placeholder="Auto calculated"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Received (₹)</label>
                  <input
                    type="number"
                    className="w-full p-3 border-2 border-red-200 rounded-lg bg-white hover:border-red-300 focus:border-red-500 transition-colors"
                    value={newTransaction.received}
                    onChange={(e) => setNewTransaction({...newTransaction, received: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid By</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-green-200 rounded-lg bg-white hover:border-green-300 focus:border-green-500 transition-colors"
                    value={newPayment.paidBy}
                    onChange={(e) => setNewPayment({...newPayment, paidBy: e.target.value})}
                    placeholder="Who made the payment"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-indigo-200 rounded-lg bg-white hover:border-indigo-300 focus:border-indigo-500 transition-colors"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    placeholder="Payment notes"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
                >
                  <FiX className="mr-2" /> Cancel
                </Button>
                <Button 
                  onClick={handleAddTransaction}
                  disabled={!newTransaction.name || !newTransaction.date || !newTransaction.siteId}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg px-4 py-2"
                >
                  <FiSave className="mr-2" /> Save Transaction
                </Button>
              </div>
            </motion.div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Site</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Transferred (₹)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Percentage Cut (%)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Receivable (₹)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Received (₹)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Remaining (₹)</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                        No transactions found matching your search
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editingId === transaction._id ? (
                            <input
                              type="date"
                              className="w-full p-1 border border-gray-300 rounded"
                              value={transaction.date}
                              onChange={(e) => handleEditTransaction(transaction._id, 'date', e.target.value)}
                            />
                          ) : (
                            new Date(transaction.date).toLocaleDateString()
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="font-medium text-blue-600">{getSiteName(transaction.siteId)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === transaction._id ? (
                            <input
                              type="text"
                              className="w-full p-1 border border-gray-300 rounded"
                              value={transaction.name}
                              onChange={(e) => handleEditTransaction(transaction._id, 'name', e.target.value)}
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {editingId === transaction._id ? (
                            <input
                              type="number"
                              className="w-full p-1 border border-gray-300 rounded text-right"
                              value={transaction.transferred}
                              onChange={(e) => handleEditTransaction(transaction._id, 'transferred', Number(e.target.value))}
                            />
                          ) : (
                            `₹${transaction.transferred.toLocaleString()}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {editingId === transaction._id ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              className="w-full p-1 border border-gray-300 rounded text-right"
                              value={transaction.percentage}
                              onChange={(e) => handleEditTransaction(transaction._id, 'percentage', Number(e.target.value))}
                            />
                          ) : (
                            `${transaction.percentage?.toFixed(2) || '0'}%`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {editingId === transaction._id ? (
                            <input
                              type="number"
                              className="w-full p-1 border border-gray-300 rounded text-right"
                              value={transaction.receivableAmount}
                              onChange={(e) => handleEditTransaction(transaction._id, 'receivableAmount', Number(e.target.value))}
                            />
                          ) : (
                            `₹${transaction.receivableAmount?.toLocaleString() || '0'}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {editingId === transaction._id ? (
                            <input
                              type="number"
                              className="w-full p-1 border border-gray-300 rounded text-right"
                              value={transaction.received}
                              onChange={(e) => handleEditTransaction(transaction._id, 'received', Number(e.target.value))}
                            />
                          ) : (
                            `₹${transaction.received.toLocaleString()}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          ₹{transaction.remaining.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            {editingId === transaction._id ? (
                              <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => saveEditTransaction(transaction._id!)}
                              >
                                <FiSave />
                              </button>
                            ) : (
                              <>
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => startEditing(transaction._id)}
                                >
                                  <FiEdit2 />
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => setShowPaymentLog(transaction._id)}
                                  title="Add Payment"
                                >
                                  <FiDollarSign />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDeleteTransaction(transaction._id)}
                                >
                                  <FiTrash2 />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredTransactions.length > 0 && (
                  <tfoot className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-sm font-medium text-gray-700">
                        Totals
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700 text-right">
                        ₹{totalTransferred.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700 text-right">
                        -
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700 text-right">
                        ₹{filteredTransactions.reduce((sum, item) => sum + (item.receivableAmount || 0), 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700 text-right">
                        ₹{totalReceived.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-gray-700 text-right">
                        ₹{totalRemaining.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Payment Logs Section */}
          {transactions.map((transaction) => (
            transaction.paymentLogs && transaction.paymentLogs.length > 0 && (
              <div key={`logs-${transaction._id}`} className="mt-6 bg-white rounded-lg shadow border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Payment Logs - {transaction.name}
                  </h3>
                  <p className="text-sm text-gray-600">Payment history for this transaction</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Paid By</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Amount (₹)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transaction.paymentLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(log.date).toLocaleString('en-IN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FiUser className="mr-2 text-gray-400" />
                              {log.paidBy}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            ₹{log.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {log.notes || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}

          {/* Add Payment Modal */}
          {showPaymentLog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Payment</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={newPayment.dateTime || new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setNewPayment({...newPayment, dateTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: Number(e.target.value)})}
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Paid By</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={newPayment.paidBy}
                      onChange={(e) => setNewPayment({...newPayment, paidBy: e.target.value})}
                      placeholder="Who made the payment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={newPayment.notes}
                      onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                      placeholder="Payment notes"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setShowPaymentLog(null);
                      setNewPayment({ amount: 0, paidBy: '', notes: '', dateTime: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleAddPayment(showPaymentLog)}
                    disabled={!newPayment.amount || !newPayment.paidBy}
                  >
                    Add Payment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
};

export default ExtraFinance;