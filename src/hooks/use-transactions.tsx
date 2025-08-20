
import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/types/inventory";
import { getAllTransactions, getTransactionsByDate, getTransactionsByMaterial, getTransactionsByProject } from "@/services/inventoryService";

interface TransactionFilters {
  projectId?: string;
  startDate?: string;
  endDate?: string;
  materialName?: string;
}

// Function to fetch transactions from API
const fetchTransactions = async (filters?: TransactionFilters): Promise<Transaction[]> => {
  try {
    let transactions;
    
    if (filters?.projectId) {
      // If projectId is provided, get transactions for that specific project
      transactions = await getTransactionsByProject(filters.projectId);
    } else if (filters?.startDate && filters?.endDate) {
      transactions = await getTransactionsByDate(filters.startDate, filters.endDate);
    } else if (filters?.materialName) {
      transactions = await getTransactionsByMaterial(filters.materialName);
    } else {
      transactions = await getAllTransactions();
    }
    
    // Transform backend data to frontend format
    return transactions.map((transaction: any) => ({
      id: transaction._id,
      material: transaction.materialName,
      quantity: transaction.quantity,
      unit: transaction.unit,
      type: transaction.transactionType === 'add' ? 'added' : 
            transaction.transactionType === 'remove' ? 'removed' : 'updated',
      note: transaction.description || '',
      date: new Date(transaction.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: new Date(transaction.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      projectId: transaction.projectId || 'default',
      materialId: transaction.materialId?._id || transaction.materialId,
      materialDetails: transaction.materialId || null
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

export const useTransactions = (filters?: TransactionFilters) => {
  const query = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
