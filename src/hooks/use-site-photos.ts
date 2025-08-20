import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import {
  getSitePhotos,
  uploadSitePhoto,
  updateSitePhoto,
  deleteSitePhoto,
  getSitePhotoStats,
  SitePhoto,
  SitePhotoStats
} from '@/services/sitePhotoService';

export const useSitePhotos = (siteId?: string) => {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [stats, setStats] = useState<SitePhotoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    if (!siteId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getSitePhotos(siteId);
      setPhotos(data);
    } catch (err) {
      setError('Failed to fetch photos');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!siteId) return;
    
    try {
      const data = await getSitePhotoStats(siteId);
      setStats(data);
    } catch (err) {
      console.error('Error fetching photo stats:', err);
    }
  };

  const uploadPhoto = async (photoData: FormData) => {
    try {
      setLoading(true);
      const newPhoto = await uploadSitePhoto(photoData);
      setPhotos(prev => [newPhoto, ...prev]);
      await fetchStats(); // Refresh stats
      return newPhoto;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePhoto = async (id: string, updateData: Partial<SitePhoto>) => {
    try {
      const updatedPhoto = await updateSitePhoto(id, updateData);
      setPhotos(prev => prev.map(photo => 
        photo._id === id ? updatedPhoto : photo
      ));
      return updatedPhoto;
    } catch (err) {
      toast.error('Failed to update photo');
      throw err;
    }
  };

  const removePhoto = async (id: string) => {
    try {
      await deleteSitePhoto(id);
      setPhotos(prev => prev.filter(photo => photo._id !== id));
      await fetchStats(); // Refresh stats
      toast.success('Photo deleted successfully');
    } catch (err) {
      toast.error('Failed to delete photo');
      throw err;
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchPhotos();
      fetchStats();
    }
  }, [siteId]);

  return {
    photos,
    stats,
    loading,
    error,
    uploadPhoto,
    updatePhoto,
    removePhoto,
    refetch: fetchPhotos
  };
}; 