import React, { useState } from "react";
import { Calendar, Filter, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactions } from "@/hooks/use-transactions";
import { Transaction } from "@/types/inventory";

interface TransactionHistoryProps {
  projectId?: string;
  title?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  projectId, 
  title = "Transaction History" 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  const { transactions, isLoading, refetch } = useTransactions({ projectId });

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || transaction.date.includes(dateFilter);
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesDate && matchesType;
  });

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "bg-green-100 text-green-800 border-green-200";
      case "removed":
        return "bg-red-100 text-red-800 border-red-200";
      case "updated":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case "added":
        return "➕";
      case "removed":
        return "➖";
      case "updated":
        return "✏️";
      default:
        return "📝";
    }
  };

  const handleExport = () => {
    const header = ['Date', 'Time', 'Material', 'Type', 'Quantity', 'Unit', 'Details'];
    
    const csvContent = [
      header.join(','),
      ...filteredTransactions.map(transaction => [
        transaction.date,
        transaction.time,
        transaction.material,
        transaction.type,
        transaction.quantity,
        transaction.unit,
        transaction.note
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${projectId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="animate-spin h-6 w-6 text-gray-400 mr-2" />
          <span className="text-gray-500">Loading transactions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={20} />
            <h2 className="text-lg font-medium">{title}</h2>
            {projectId && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Site: {projectId}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search</Label>
            <Input
              id="search"
              placeholder="Search materials or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">Date Filter</Label>
            <Input
              id="dateFilter"
              type="text"
              placeholder="Filter by date..."
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="typeFilter" className="text-sm font-medium text-gray-700">Type</Label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="added">Added</option>
              <option value="removed">Removed</option>
              <option value="updated">Updated</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <div className="text-sm text-gray-500">
              {filteredTransactions.length} of {transactions.length} transactions
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-lg font-medium mb-2">No transactions found</div>
            <div className="text-sm">
              {searchQuery || dateFilter || typeFilter !== "all" 
                ? "Try adjusting your filters" 
                : "No transactions have been recorded yet."}
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.date}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {transaction.time}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">
                      {transaction.material}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full border ${getTransactionTypeColor(transaction.type)}`}>
                      <span className="mr-1">{getTransactionTypeIcon(transaction.type)}</span>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="text-gray-900 font-medium">
                      {transaction.quantity} {transaction.unit}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="max-w-xs">
                      {transaction.note}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;