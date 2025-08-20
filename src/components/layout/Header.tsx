
import React from 'react';
import { Bell, ChevronDown, Plus, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type HeaderProps = {
  title?: string;
  showSiteSelector?: boolean;
  onAddSite?: () => void;
  selectedSite?: string;
  sites?: { _id: string; siteName: string; }[];
  onSelectSite?: (siteId: string) => void;
  onChangeSite?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  title,
  showSiteSelector = false,
  onAddSite,
  selectedSite,
  sites = [],
  onSelectSite,
  onChangeSite,
}) => {
  const selectedSiteData = sites.find(site => site._id === selectedSite);
  
  // Check if the title already contains the site name (for attendance management)
  const titleContainsSiteName = title && selectedSiteData && title.includes(selectedSiteData.siteName);

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4 bg-white">
        {showSiteSelector ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-white">
                <span>{selectedSiteData?.siteName || 'Select Site'}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white shadow-lg border rounded-md">
              {sites.map((site) => (
                <DropdownMenuItem
                  key={site._id}
                  onClick={() => onSelectSite && onSelectSite(site._id)}
                >
                  {site.siteName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          selectedSiteData && (
            <div className="flex items-center gap-2">
              {!titleContainsSiteName && (
                <span className="font-semibold">{selectedSiteData.siteName}</span>
              )}
              {onChangeSite && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onChangeSite}
                  className="text-xs"
                >
                  Change Site
                </Button>
              )}
            </div>
          )
        )}
        {title && <h2 className="text-xl font-bold">{title}</h2>}
      </div>
      <div className="flex items-center gap-4">
        {onAddSite && (
          <Button className="flex border-2 items-center gap-2" onClick={onAddSite}>
            <Plus size={16} />
            <span>Add Site</span>
          </Button>
        )}
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Sun size={20} />
        </Button>
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      </div>
    </div>
  );
};

export default Header;
