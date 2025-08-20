import axios from 'axios';
const API_URL = '/api/tender';

export const getTenders = async () => {
  const response = await fetch('/api/tender');
  if (!response.ok) throw new Error('Failed to fetch tenders');
  const data = await response.json();
  console.log('Fetched tenders:', data);
  return data;
};

export const addTender = async (tender: {
  name: string;
  amount: number;
  emd: number;
  defectLiabilityPeriod: number;
  securityDeposit: number;
  status: string;
  reason?: string;
}) => {
  const requestBody = {
    name: tender.name,
    amount: tender.amount,
    emd: tender.emd,
    defectLiabilityPeriod: tender.defectLiabilityPeriod,
    securityDeposit: tender.securityDeposit,
    status: tender.status,
    rejectionReason: tender.reason || undefined
  };
  
  console.log('Sending tender data:', requestBody);
  
  const response = await fetch('/api/tender', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  if (!response.ok) throw new Error('Failed to add tender');
  const result = await response.json();
  console.log('Received response:', result);
  return result;
};

export const updateTender = async (id: string, formData: any) => {
  const updateData = {
    ...formData,
    rejectionReason: formData.reason || undefined
  };
  const res = await axios.put(`${API_URL}/${id}`, updateData);
  return res.data;
};

//Delete Tender API
export const deleteTender = async (id: string) => {
  const response = await axios.delete(`/api/tender/${id}`);
  return response.data;
};

