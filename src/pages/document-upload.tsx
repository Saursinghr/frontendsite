import { useState, useRef, ChangeEvent, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Upload, Download, Search, Filter, X, FileText, File, Image, FileSpreadsheet, ChevronDown, Trash2, Edit } from "lucide-react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { getAllSites, SiteResponse } from '@/services/siteService';
import { 
  getDocuments, 
  uploadDocument, 
  downloadDocument, 
  deleteDocument, 
  getDocumentStats,
  formatFileSize,
  getFileIcon,
  type Document,
  type DocumentFilters,
  type DocumentStats
} from '@/services/documentService';
import Header from "@/components/layout/Header";

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newDocument, setNewDocument] = useState({
    title: "",
    description: "",
    projectId: "",
    file: null as File | null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch sites on component mount
  useEffect(() => {
    getAllSites().then(setSites);
  }, []);

  // Set selected site when URL changes
  useEffect(() => {
    if (id && sites.length > 0) {
      const site = sites.find(s => s._id === id);
      setSelectedSite(site || null);
      setShowSiteSelector(false);
    } else if (!id) {
      setSelectedSite(null);
      setShowSiteSelector(true);
    }
  }, [id, sites]);

  const handleSelectSite = (siteId: string) => {
    navigate(`/documents/${siteId}`);
  };

  const handleChangeSite = () => {
    setShowSiteSelector(true);
    navigate(`/documents`);
  };

  // Set the selected site as the default projectId when a site is selected
  useEffect(() => {
    if (selectedSite) {
      setNewDocument(prev => ({
        ...prev,
        projectId: selectedSite._id
      }));
    }
  }, [selectedSite]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [documentsData, statsData] = await Promise.all([
          getDocuments(selectedSite ? { projectId: selectedSite._id } : {}),
          getDocumentStats(selectedSite?._id)
        ]);
        setDocuments(documentsData.documents);
        setStats(statsData.stats);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    if (sites.length > 0) {
      fetchData();
    }
  }, [selectedSite, sites]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument({
        ...newDocument,
        file: e.target.files[0]
      });
    }
  };

  const handleUpload = async () => {
    const projectId = selectedSite ? selectedSite._id : newDocument.projectId;
    
    if (!newDocument.title || !newDocument.file || !projectId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('document', newDocument.file);
      formData.append('title', newDocument.title);
      formData.append('description', newDocument.description);
      formData.append('projectId', projectId);
      formData.append('uploadedBy', 'Current User'); // You can get this from auth context
      
      const result = await uploadDocument(formData);
      
      setDocuments([result.document, ...documents]);
      setNewDocument({
        title: "",
        description: "",
        projectId: "",
        file: null
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      toast.success('Document uploaded successfully');
      
      // Refresh stats
      const statsData = await getDocumentStats(selectedSite?._id);
      setStats(statsData.stats);
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await downloadDocument(doc._id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Document downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading document:', error);
      toast.error(error.message || 'Failed to download document');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      setDeleting(documentId);
      await deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      toast.success('Document deleted successfully');
      
      // Refresh stats
      const statsData = await getDocumentStats(selectedSite?._id);
      setStats(statsData.stats);
    } catch (error: any) {
      console.error('Error deleting document:', error);
      toast.error(error.message || 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = (doc.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (doc.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (doc.uploadedBy?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getFileIconComponent = (mimeType: string) => {
    const type = getFileIcon(mimeType || '');
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx': return <File className="h-5 w-5 text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'image': return <Image className="h-5 w-5 text-yellow-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

    return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <Header
          title={selectedSite ? `${selectedSite.siteName} - Documents` : 'Documents Management'}
          showSiteSelector={showSiteSelector}
          selectedSite={selectedSite?._id}
          sites={sites}
          onSelectSite={handleSelectSite}
          onChangeSite={handleChangeSite}
        />

        <main className="flex-1 overflow-auto p-6 bg-[#f6f7fb]">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-gray-500">Manage your construction documents and files</p>
              </div>
            </div>
          </div>


                 {/* Upload Section */}
         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
           <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload New Document</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Document Title *
                 </label>
                 <input
                   type="text"
                   value={newDocument.title}
                   onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                   placeholder="e.g., Site Inspection Report"
                   className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Description (Optional)
                 </label>
                 <textarea
                   value={newDocument.description}
                   onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                   placeholder="Brief description of the document..."
                   rows={3}
                   className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Project/Site *
                 </label>
                 {selectedSite ? (
                   <div className="w-full border border-gray-300 px-4 py-2 rounded-md bg-gray-50 text-gray-700">
                     {selectedSite.siteName} (Selected Site)
                   </div>
                 ) : (
                   <select
                     value={newDocument.projectId}
                     onChange={(e) => setNewDocument({...newDocument, projectId: e.target.value})}
                     className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     required
                   >
                     <option value="">Select a project/site</option>
                     {sites.map(site => (
                       <option key={site._id} value={site._id}>
                         {site.siteName}
                       </option>
                     ))}
                   </select>
                 )}
               </div>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Upload File *
                 </label>
                 <div className="flex items-center justify-center w-full">
                   <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                       <Upload className="w-8 h-8 mb-3 text-gray-400" />
                       {newDocument.file ? (
                         <p className="text-sm text-gray-500 font-medium">
                           {newDocument.file.name}
                         </p>
                       ) : (
                         <>
                           <p className="mb-2 text-sm text-gray-500">
                             <span className="font-semibold">Click to upload</span> or drag and drop
                           </p>
                           <p className="text-xs text-gray-500">
                             PDF, DOCX, XLSX, JPG, PNG, DWG (Max 20MB)
                           </p>
                         </>
                       )}
                     </div>
                     <input 
                       ref={fileInputRef}
                       type="file" 
                       className="hidden" 
                       onChange={handleFileChange}
                       accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.dwg"
                     />
                   </label>
                 </div>
               </div>
               
               <div className="flex justify-end">
                 <Button 
                   onClick={handleUpload}
                   disabled={!newDocument.title || !newDocument.file || (!newDocument.projectId && !selectedSite) || uploading}
                   className="gap-2"
                 >
                   <Upload className="h-4 w-4" />
                   {uploading ? "Uploading..." : "Upload Document"}
                 </Button>
               </div>
             </div>
           </div>
         </div>

         {/* Documents List */}
         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
           <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <h2 className="text-lg font-semibold text-gray-800">
               {selectedSite ? `${selectedSite.siteName} Documents` : 'All Site Documents'}
             </h2>
             
             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
               <div className="relative w-full sm:w-64">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input
                   type="text"
                   placeholder="Search documents..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 />
               </div>
             </div>
           </div>
           
           <div className="overflow-auto">
             {loading ? (
               <div className="text-center py-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                 <p className="mt-2 text-sm text-gray-500">Loading documents...</p>
               </div>
             ) : filteredDocuments.length === 0 ? (
               <div className="text-center py-12">
                 <File className="mx-auto h-12 w-12 text-gray-400" />
                 <h3 className="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
                 <p className="mt-1 text-sm text-gray-500">
                   Try changing your search or filter criteria
                 </p>
               </div>
             ) : (
               <table className="w-full text-left">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="p-3 font-semibold text-gray-700 min-w-[200px]">Document</th>
                     <th className="p-3 font-semibold text-gray-700 min-w-[200px]">Description</th>
                     <th className="p-3 font-semibold text-gray-700 min-w-[150px]">Site</th>
                     <th className="p-3 font-semibold text-gray-700 min-w-[140px]">Uploaded By</th>
                     <th className="p-3 font-semibold text-gray-700 min-w-[100px]">Date</th>
                     <th className="p-3 font-semibold text-gray-700 min-w-[100px]">Size</th>
                     <th className="p-3 font-semibold text-gray-700 text-right min-w-[120px]">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200">
                   {filteredDocuments.map((doc) => (
                     <tr key={doc._id} className="hover:bg-gray-50">
                       <td className="p-3">
                         <div className="flex items-center gap-3">
                           <div className="bg-gray-100 rounded-lg p-2">
                             {getFileIconComponent(doc.mimeType)}
                           </div>
                           <div>
                             <div className="font-medium text-gray-900">{doc.title || 'Untitled'}</div>
                             <div className="text-xs text-gray-500 mt-1">
                               {doc.originalName || 'Unknown file'}
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="p-3 text-gray-700 text-sm">
                         {doc.description || "No description"}
                       </td>
                       <td className="p-3">
                         <div>
                           <div className="font-medium text-gray-900">{doc.projectId?.siteName || 'Unknown Site'}</div>
                           <div className="text-xs text-gray-500 mt-1">
                             {doc.projectId?.siteCode || 'N/A'}
                           </div>
                         </div>
                       </td>
                       <td className="p-3 text-gray-700">{doc.uploadedBy || 'Unknown'}</td>
                       <td className="p-3 text-gray-700">
                         {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'N/A'}
                       </td>
                       <td className="p-3 text-gray-700">{formatFileSize(doc.fileSize || 0)}</td>
                       <td className="p-3 text-right">
                         <div className="flex gap-2 justify-end">
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="gap-1"
                             onClick={() => handleDownload(doc)}
                           >
                             <Download className="h-4 w-4" /> Download
                           </Button>
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="gap-1 text-red-600 hover:text-red-700"
                             onClick={() => handleDelete(doc._id)}
                             disabled={deleting === doc._id}
                           >
                             {deleting === doc._id ? (
                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                             ) : (
                               <Trash2 className="h-4 w-4" />
                             )}
                           </Button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
         </div>

         {/* Stats */}
         {stats && (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
             <div className="bg-white p-4 rounded-lg shadow-sm">
               <div className="text-2xl font-bold text-blue-600">{stats.totalDocuments || 0}</div>
               <div className="text-sm font-medium text-gray-600">Total Documents</div>
             </div>
             <div className="bg-white p-4 rounded-lg shadow-sm">
               <div className="text-2xl font-bold text-green-600">
                 {formatFileSize(stats.totalSize || 0)}
               </div>
               <div className="text-sm font-medium text-gray-600">Total Size</div>
             </div>
             <div className="bg-white p-4 rounded-lg shadow-sm">
               <div className="text-2xl font-bold text-purple-600">
                 {stats.byCategory?.length || 0}
               </div>
               <div className="text-sm font-medium text-gray-600">Categories</div>
             </div>
             <div className="bg-white p-4 rounded-lg shadow-sm">
               <div className="text-2xl font-bold text-yellow-600">
                 {documents.filter(d => d.uploadedBy === "Current User").length}
               </div>
               <div className="text-sm font-medium text-gray-600">Your Uploads</div>
             </div>
           </div>
         )}
       </main>
     </div>
   </MainLayout>
 );
};

export default Documents;