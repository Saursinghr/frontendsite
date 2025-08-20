import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Search,
  Grid3X3,
  List,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadSitePhoto, getSitePhotos, deleteSitePhoto, type SitePhoto } from '@/services/sitePhotoService';

interface GalleryProps {
  siteId: string;
  siteName: string;
}

const Gallery: React.FC<GalleryProps> = ({ siteId, siteName }) => {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    photo: null as File | null
  });



  useEffect(() => {
    fetchPhotos();
  }, [siteId]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const data = await getSitePhotos(siteId);
      setPhotos(data);
    } catch (error) {
      toast.error('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setUploadForm(prev => ({ ...prev, photo: file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.photo || !uploadForm.name.trim()) {
      toast.error('Please select a photo and provide a name');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', uploadForm.photo);
      formData.append('siteId', siteId);
      formData.append('siteName', siteName);
             formData.append('name', uploadForm.name);
       formData.append('description', uploadForm.description);
      formData.append('uploadedBy', 'Current User'); // Get from auth context
      formData.append('uploadTime', new Date().toLocaleTimeString());

      await uploadSitePhoto(formData);
      
      toast.success('Photo uploaded successfully');
      setIsUploadDialogOpen(false);
             setUploadForm({
         name: '',
         description: '',
         photo: null
       });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchPhotos();
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await deleteSitePhoto(photoId);
        toast.success('Photo deleted successfully');
        fetchPhotos();
      } catch (error) {
        toast.error('Failed to delete photo');
      }
    }
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = (photo.name && photo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Gallery</h2>
          <p className="text-gray-600">Manage and view site photos</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Photo
              </Button>
            </DialogTrigger>
                         <DialogContent className="max-w-2xl bg-white">
              <DialogHeader>
                <DialogTitle>Upload New Photo</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Photo Upload */}
                <div>
                  <Label htmlFor="photo">Photo *</Label>
                  <div className="mt-2">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {uploadForm.photo ? (
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">{uploadForm.photo.name}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        id="photo"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name">Photo Name *</Label>
                  <Input
                    id="name"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter photo name"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter photo description"
                    rows={3}
                  />
                </div>

                

                {/* Upload Time Display */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Upload Time: {new Date().toLocaleTimeString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !uploadForm.photo || !uploadForm.name.trim()}
                    className="gap-2"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

             {/* Search Filter */}
       <div className="relative">
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
         <Input
           placeholder="Search photos by name or description..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="pl-10"
         />
       </div>

      {/* Photos Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-600">Upload your first photo to get started</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredPhotos.map((photo) => (
            <Card key={photo._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                                 <img
                   src={`http://localhost:5000/${photo.photoFile}`}
                   alt={photo.name || 'Site Photo'}
                   className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setIsViewDialogOpen(true);
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDelete(photo._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                                 <div className="space-y-2">
                   <h3 className="font-semibold text-gray-900 truncate">{photo.name || 'Untitled Photo'}</h3>
                  
                                     {photo.description && photo.description.trim() && (
                     <p className="text-sm text-gray-600 line-clamp-2">{photo.description}</p>
                   )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(photo.uploadDate)}</span>
                                         <Clock className="h-3 w-3 ml-2" />
                     <span>{photo.uploadTime || 'N/A'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                         <User className="h-3 w-3" />
                     <span>{photo.uploadedBy || 'Unknown'}</span>
                  </div>
                  
                                     
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

             {/* Photo View Dialog */}
       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
         <DialogContent className="max-w-4xl bg-white">
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-lg">
                                 <img
                   src={`http://localhost:5000/${selectedPhoto.photoFile}`}
                   alt={selectedPhoto.name || 'Site Photo'}
                   className="w-full h-full object-contain"
                />
              </div>
              
              <div className="space-y-4">
                                 <div>
                   <h3 className="text-xl font-semibold text-gray-900">{selectedPhoto.name || 'Untitled Photo'}</h3>
                                     {selectedPhoto.description && selectedPhoto.description.trim() && (
                     <p className="text-gray-600 mt-2">{selectedPhoto.description}</p>
                   )}
                </div>
                
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-gray-400" />
                       <span>Upload Date: {formatDate(selectedPhoto.uploadDate)}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Clock className="h-4 w-4 text-gray-400" />
                       <span>Upload Time: {selectedPhoto.uploadTime || 'N/A'}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <User className="h-4 w-4 text-gray-400" />
                       <span>Uploaded By: {selectedPhoto.uploadedBy || 'Unknown'}</span>
                     </div>
                   </div>
                   

                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
