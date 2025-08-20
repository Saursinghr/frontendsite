import { useState, useEffect } from "react";
import {
  Plus,
  Download,
  Search,
  X,
  FileText,
  CheckCircle,
  BarChart2,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileSearch,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { getTenders, addTender, updateTender, deleteTender } from "@/services/tenderService";

type Tender = {
  id: string;
  name: string;
  amount: number;
  emd: number;
  defectLiabilityPeriod: number;
  securityDeposit: number;
  status: string;
  reason: string;
};

const TenderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [viewingTender, setViewingTender] = useState<Tender | null>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTenders()
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item._id,
          name: item.name || "",
          amount: item.amount || 0,
          emd: item.emd || 0,
          defectLiabilityPeriod: item.defectLiabilityPeriod || 0,
          securityDeposit: item.securityDeposit || 0,
          status: item.status || "pending",
          reason: item.rejectionReason || ""
        }));
        setTenders(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const [formData, setFormData] = useState<Omit<Tender, 'id'>>({
    name: "",
    amount: 0,
    emd: 0,
    defectLiabilityPeriod: 0,
    securityDeposit: 0,
    status: "pending",
    reason: "",
  });

  const totalTenders = tenders.length;
  const approvedTenders = tenders.filter((t) => t.status === "approved");
  const approvedPercent =
    totalTenders > 0
      ? Math.round((approvedTenders.length / totalTenders) * 100)
      : 0;

  const filteredTenders = tenders.filter((tender) =>
    tender.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false
  );

  const handleAddTender = async () => {
    if (!formData.name || formData.amount <= 0) return;
    try {
      const newTender = await addTender(formData);
      setTenders([
        ...tenders,
        {
          id: newTender._id || Date.now().toString(),
          name: newTender.name || "",
          amount: newTender.amount || 0,
          emd: newTender.emd || 0,
          defectLiabilityPeriod: newTender.defectLiabilityPeriod || 0,
          securityDeposit: newTender.securityDeposit || 0,
          status: newTender.status || "pending",
          reason: newTender.rejectionReason || ""
        }
      ]);
      resetForm();
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to add tender");
    }
  };

  const handleEditTender = (id: string) => {
    const tender = tenders.find(t => t.id === id);
    if (tender) {
      setFormData({
        name: tender.name,
        amount: tender.amount,
        emd: tender.emd,
        defectLiabilityPeriod: tender.defectLiabilityPeriod,
        securityDeposit: tender.securityDeposit,
        status: tender.status,
        reason: tender.reason
      });
      setEditingId(id);
      setIsFormOpen(true);
    }
  };

  const handleUpdateTender = async () => {
    if (!editingId || !formData.name || formData.amount <= 0) return;
    try {
      const updated = await updateTender(editingId, formData);
      setTenders(tenders.map(t =>
        t.id === editingId
          ?             {
              id: updated._id || editingId,
              name: updated.name || "",
              amount: updated.amount || 0,
              emd: updated.emd || 0,
              defectLiabilityPeriod: updated.defectLiabilityPeriod || 0,
              securityDeposit: updated.securityDeposit || 0,
              status: updated.status || "pending",
              reason: updated.rejectionReason || ""
            }
          : t
      ));
      resetForm();
      setIsFormOpen(false);
      setEditingId(null);
    } catch (err: any) {
      setError(err.message || "Failed to update tender");
    }
  };

  const handleDeleteTender = async (id: string) => {
    try {
      await deleteTender(id);
      setTenders(tenders.filter(t => t.id !== id));
      setShowDeleteModal(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete tender");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
      emd: 0,
      defectLiabilityPeriod: 0,
      securityDeposit: 0,
      status: "pending",
      reason: "",
    });
  };

  const handleFormChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'name' || field === 'reason' ? String(value) : Number(value) || 0 
    }));
  };

  const handleViewTender = (tender: Tender) => {
    setViewingTender(tender);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tender Management
            </h1>
            <p className="text-gray-600">
              Manage and track all tender applications
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={() => {
                resetForm();
                setEditingId(null);
                setIsFormOpen(true);
              }}
              className=" text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tender
            </Button>
          </div>
        </div>

        {/* Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={<FileText className="text-blue-500" />}
            title="Total Tenders"
            value={totalTenders}
            className="bg-white border border-gray-200 shadow-sm rounded-xl"
          />
          <SummaryCard
            icon={<CheckCircle className="text-green-500" />}
            title="Approved Tenders"
            value={approvedTenders.length}
            className="bg-white border border-gray-200 shadow-sm rounded-xl"
          />
          <SummaryCard
            icon={<BarChart2 className="text-purple-500" />}
            title="Approval Rate"
            value={`${approvedPercent}%`}
            isProgress
            className="bg-white border border-gray-200 shadow-sm rounded-xl"
          />
          <SummaryCard
            icon={<MoreVertical className="text-gray-500" />}
            title="More Functionality"
            value="Coming Soon"
            className="bg-white border border-gray-200 shadow-sm rounded-xl"
          />
        </div>

        {/* Search & Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredTenders.length} of {tenders.length} tenders
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3 font-medium text-gray-700">Name</th>
                  <th className="p-3 font-medium text-gray-700">Amount</th>
                  <th className="p-3 font-medium text-gray-700">EMD</th>
                  <th className="p-3 font-medium text-gray-700">Defect Liability</th>
                  <th className="p-3 font-medium text-gray-700">Security Deposit</th>
                  <th className="p-3 font-medium text-gray-700">Status</th>
                  <th className="p-3 font-medium text-gray-700">Rejection Reason</th>
                  <th className="p-3 font-medium text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      Loading tenders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-red-500">
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredTenders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-gray-400">
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                      <h3 className="text-sm font-medium text-gray-900">No tenders found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search query
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTenders.map((t) => (
                    <tr key={t.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{t.name}</td>
                      <td className="p-3">₹{t.amount.toLocaleString()}</td>
                      <td className="p-3">₹{t.emd.toLocaleString()}</td>
                                             <td className="p-3">{t.defectLiabilityPeriod || 0} months</td>
                       <td className="p-3">₹{(t.securityDeposit || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            t.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : t.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {t.status === "rejected" ? t.reason : "-"}
                      </td>
                      <td className="p-3 flex justify-center space-x-1">
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="border-gray-300 text-gray-600 hover:bg-gray-100"
                          onClick={() => handleViewTender(t)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="border-gray-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditTender(t.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="border-gray-300 text-red-600 hover:bg-red-50"
                          onClick={() => setShowDeleteModal(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tender Details Modal */}
        {viewingTender && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="text-blue-500" /> Tender Details
                </h2>
                <button 
                  onClick={() => setViewingTender(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-700">Name</h3>
                    <p className="text-gray-900">{viewingTender.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Status</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        viewingTender.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : viewingTender.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {viewingTender.status}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Amount</h3>
                    <p className="text-gray-900">₹{viewingTender.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">EMD</h3>
                    <p className="text-gray-900">₹{viewingTender.emd.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Defect Liability Period</h3>
                                         <p className="text-gray-900">{viewingTender.defectLiabilityPeriod || 0} months</p>
                   </div>
                   <div>
                     <h3 className="font-medium text-gray-700">Security Deposit</h3>
                     <p className="text-gray-900">₹{(viewingTender.securityDeposit || 0).toLocaleString()}</p>
                  </div>
                  {viewingTender.status === "rejected" && (
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-700">Rejection Reason</h3>
                      <p className="text-gray-900">{viewingTender.reason}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button 
                  onClick={() => setViewingTender(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Tender Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">
                  {editingId ? "Edit Tender" : "Add New Tender"}
                </h2>
                <button 
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tender Name *
                  </label>
                  <Input
                    placeholder="e.g., Bridge Construction"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹) *
                    </label>
                    <Input
                      type="number"
                      placeholder="5000000"
                      value={formData.amount || ""}
                      onChange={(e) => handleFormChange("amount", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      EMD (₹) *
                    </label>
                    <Input
                      type="number"
                      placeholder="50000"
                      value={formData.emd || ""}
                      onChange={(e) => handleFormChange("emd", e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">
                       Defect Liability Period (Months)
                     </label>
                                         <Input
                       type="number"
                       placeholder="12"
                       value={formData.defectLiabilityPeriod || ""}
                       onChange={(e) => handleFormChange("defectLiabilityPeriod", e.target.value)}
                     />
                  </div>
                  <div>
                                         <label className="block text-sm font-medium text-gray-700 mb-1">
                       Security Deposit (₹)
                     </label>
                                         <Input
                       type="number"
                       placeholder="500000"
                       value={formData.securityDeposit || ""}
                       onChange={(e) => handleFormChange("securityDeposit", e.target.value)}
                     />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange("status", e.target.value as Tender['status'])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                {formData.status === "rejected" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rejection Reason
                    </label>
                    <textarea
                      placeholder="Enter reason for rejection"
                      value={formData.reason}
                      onChange={(e) => handleFormChange("reason", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={editingId ? handleUpdateTender : handleAddTender}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingId ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Tender
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tender
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Delete Tender</h2>
                  <p className="text-gray-600 mt-1">
                    Are you sure you want to delete this tender? This action cannot be undone.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setShowDeleteModal(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteTender(showDeleteModal)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Tender
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

const SummaryCard = ({
  icon,
  title,
  value,
  isProgress,
  className = ""
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  isProgress?: boolean;
  className?: string;
}) => (
  <div className={`p-4 flex items-center gap-3 ${className}`}>
    <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-600">{title}</p>
      {isProgress ? (
        <>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <p className="text-xs text-right mt-1">{value}%</p>
        </>
      ) : (
        <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      )}
    </div>
  </div>
);

export default TenderManagement;