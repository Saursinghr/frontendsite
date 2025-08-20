
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import {
  getAllProcurements,
  getProcurementStats,
  updateProcurementStatus,
  createProcurement,
  updateProcurement,
  ProcurementRequest
} from '@/services/procurementService';

export function useProcurementData(siteId?: string) {
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getAllProcurements(siteId),
      getProcurementStats(siteId)
    ])
      .then(([requests, stats]) => {
        setProcurementRequests(requests);
        setStats(stats);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to fetch procurement data');
        setIsLoading(false);
      });
  }, [siteId]);

  const isValidDate = (date: any) => {
    return date && !isNaN(new Date(date).getTime());
  };

  const createRequest = async (requestData: any) => {
    try {
      // Map form data to backend model fields
      const payload = {
        ItemName: requestData.item,
        Description: requestData.description || '',
        Quantity: Number(requestData.quantity),
        Unit: requestData.unit || 'Pieces', // Send as string
        Budget: Number(requestData.budget) || 0, // Default to 0 if not provided
        Vendor: requestData.vendor,
        Priority: requestData.priority
          ? requestData.priority.charAt(0).toUpperCase() + requestData.priority.slice(1).toLowerCase()
          : 'Low',
        RequestDate: isValidDate(requestData.requestDate)
          ? new Date(requestData.requestDate).toISOString()
          : new Date().toISOString(),
        DeliveryDate: isValidDate(requestData.expectedDeliveryDate)
          ? new Date(requestData.expectedDeliveryDate).toISOString()
          : new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
        AdditionalNotes: requestData.notes || '',
        siteId: siteId // Remove default, let it be undefined if not provided
      };
      console.log('Procurement Payload:', payload);
      console.log('RequestDate:', payload.RequestDate);
      console.log('DeliveryDate:', payload.DeliveryDate);
      const created = await createProcurement(payload);
      setProcurementRequests(prev => [
        created,
        ...prev
      ]);
      toast.success('Purchase request created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create procurement request');
    }
  };

  const updateRequest = async (id: string, data: Partial<ProcurementRequest>) => {
    try {
      const updated = await updateProcurement(id, data);
      setProcurementRequests(prev => prev.map(req => req._id === id ? updated : req));
      toast.success('Purchase request updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update procurement request');
    }
  };

  const deleteRequest = async (id: string) => {
    // Implement DELETE API call here
    toast.info('Delete request API not implemented');
  };

  const markAsDelivered = async (id: string) => {
    try {
      await updateProcurementStatus(id, 'delivered');
      setProcurementRequests(prev => prev.map(req => req._id === id ? { ...req, Status: 'delivered' } : req));
      toast.success('Marked as delivered');
    } catch (err: any) {
      toast.error(err.message || 'Failed to mark as delivered');
    }
  };

  const updateBulkStatus = async (ids: string[], status: 'pending' | 'approved' | 'delivered' | 'cancelled' | 'in_transit') => {
    try {
      // Update all selected items using the Status field
      await Promise.all(ids.map(id => updateProcurementStatus(id, status)));
      
      // Update local state
      setProcurementRequests(prev => prev.map(req => 
        ids.includes(req._id) 
          ? { ...req, Status: status }
          : req
      ));
      
      toast.success(`Updated ${ids.length} item(s) status to ${status}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update bulk status');
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'approved' | 'delivered' | 'cancelled' | 'in_transit') => {
    try {
      // Use the new Status field for status updates
      await updateProcurementStatus(id, status);
      
      // Update local state
      setProcurementRequests(prev => prev.map(req => 
        req._id === id 
          ? { ...req, Status: status }
          : req
      ));
      
      toast.success(`Status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  return {
    procurementRequests,
    isLoading,
    stats,
    createRequest,
    updateRequest,
    deleteRequest,
    markAsDelivered,
    updateBulkStatus,
    handleStatusChange
  };
}
