import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Image as ImageIcon, 
  Building2, 
  Grid3X3,
  List,
  Plus,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { getAllSites, type SiteResponse } from '@/services/siteService';
import { getAllSitePhotos, type SitePhoto } from '@/services/sitePhotoService';
import Gallery from '@/components/site/Gallery';

const GalleryPage: React.FC = () => {
  const [sites, setSites] = useState<SiteResponse[]>([]);
  const [selectedSite, setSelectedSite] = useState<SiteResponse | null>(null);
  const [allPhotos, setAllPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'site' | 'all'>('site');

  useEffect(() => {
    fetchSites();
    fetchAllPhotos();
  }, []);

  const fetchSites = async () => {
    try {
      const data = await getAllSites();
      setSites(data);
      if (data.length > 0) {
        setSelectedSite(data[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch sites');
    }
  };

  const fetchAllPhotos = async () => {
    try {
      setLoading(true);
      const data = await getAllSitePhotos();
      setAllPhotos(data);
    } catch (error) {
      toast.error('Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const getPhotoStats = () => {
    const totalPhotos = allPhotos.length;
    const thisMonth = allPhotos.filter(photo => {
      const photoDate = new Date(photo.uploadDate);
      const now = new Date();
      return photoDate.getMonth() === now.getMonth() && 
             photoDate.getFullYear() === now.getFullYear();
    }).length;

              return { totalPhotos, thisMonth };
  };

  const stats = getPhotoStats();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
            <p className="text-gray-600">Manage and view all site photos</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'site' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('site')}
            >
              Site View
            </Button>
            <Button
              variant={viewMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('all')}
            >
              All Photos
            </Button>
          </div>
        </div>

                 {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Photos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPhotos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Sites</p>
                  <p className="text-2xl font-bold text-gray-900">{sites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>

        {/* Site Selection */}
        {viewMode === 'site' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Select Site
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select 
                    value={selectedSite?._id || ''} 
                    onValueChange={(value) => {
                      const site = sites.find(s => s._id === value);
                      setSelectedSite(site || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site._id} value={site._id}>
                          {site.siteName} ({site.siteCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedSite && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {allPhotos.filter(photo => photo.siteId === selectedSite._id).length} photos
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery Content */}
        {viewMode === 'site' && selectedSite ? (
          <Gallery siteId={selectedSite._id} siteName={selectedSite.siteName} />
        ) : viewMode === 'all' ? (
          <div className="space-y-6">
            {/* All Photos Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Site Photos</h2>
                <p className="text-gray-600">View photos from all sites</p>
              </div>
            </div>

            {/* All Photos Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : allPhotos.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
                <p className="text-gray-600">Upload photos to sites to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allPhotos.map((photo) => (
                  <Card key={photo._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square">
                                               <img
                           src={`http://localhost:5000/${photo.photoFile}`}
                           alt={photo.name || 'Site Photo'}
                           className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="text-xs">
                          {photo.siteName}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-2">
                                                 <h3 className="font-semibold text-gray-900 truncate">{photo.name || 'Untitled Photo'}</h3>
                        
                                                 {photo.description && photo.description.trim() && (
                           <p className="text-sm text-gray-600 line-clamp-2">{photo.description}</p>
                         )}
                        
                                                 <div className="flex items-center gap-2 text-xs text-gray-500">
                           <span>{photo.uploadDate ? new Date(photo.uploadDate).toLocaleDateString() : 'N/A'}</span>
                           <span>•</span>
                           <span>{photo.uploadTime || 'N/A'}</span>
                         </div>
                        
                        
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a site</h3>
            <p className="text-gray-600">Choose a site to view its gallery</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GalleryPage;
