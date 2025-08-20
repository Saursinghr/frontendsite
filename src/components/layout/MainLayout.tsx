import React from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  ShoppingCart,
  Package,
  BarChart3,
  FileText,
  Truck,
  Navigation,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  DollarSign,
  ChartBar
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  to: string;
  isActive?: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, to, isActive }) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={text}>
        <Link to={to} className="flex items-center space-x-3">
          {icon}
          <span>{text}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const [financeOpen, setFinanceOpen] = React.useState(false); // State to toggle finance submenu
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar variant="inset">
          <SidebarContent>
            {/* Logo */}
            <div className="flex h-16 items-center px-4">
  <NavLink to="/" className="flex items-center">
    <img 
      src="/logo.jpg" 
      alt="Logo" 
      className="h-10 w-auto object-contain" 
    />
  </NavLink>
</div>


            {/* Navigation */}
            <SidebarMenu>
              <SidebarItem
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                to="/"
                isActive={isActive("/")}
              />
              <SidebarItem
                icon={<Users size={20} />}
                text="Attendace Management"
                to="/labor"
                isActive={isActive("/labor")}
              />
              <SidebarItem
                icon={<CalendarClock size={20} />}
                text="Tasks & Schedule"
                to="/tasks"
                isActive={isActive("/tasksCalender")}
              />
              <SidebarItem
                icon={<Users size={20} />}
                text="Team Management"
                to="/team"
                isActive={isActive("/team")}
              />
              <SidebarItem
                icon={<ShoppingCart size={20} />}
                text="Procurement"
                to="/procurement"
                isActive={isActive("/procurement")}
              />
              <SidebarItem
                icon={<Package size={20} />}
                text="Inventory"
                to="/inventory"
                isActive={isActive("/inventory")}
              />

              {/* Finance with toggleable submenu */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Finance"
                  onClick={() => {
                    setFinanceOpen(!financeOpen);
                    navigate("/finance");
                  }}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={20} />
                    <span>Finance</span>
                  </div>
                  {financeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Submenu items for Finance */}
              {financeOpen && (
                <div className="pl-10 space-y-1 text-sm text-muted-foreground">
                  <NavLink
                    to="/finance/payroll"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 pb-2 hover:text-primary ${isActive ? "text-primary font-medium" : ""
                      }`
                    }
                  >
                    <DollarSign size={16} />
                    <span>Payroll</span>
                  </NavLink>
                   <NavLink
                    to="/finance/extra-finance"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 hover:text-primary ${isActive ? "text-primary font-medium" : ""
                      }`
                    }
                  >
                    <DollarSign size={16} />
                    <span>Extra Fianance</span>
                  </NavLink>
                </div>
                
              )}

              <SidebarItem
                icon={<FileText size={20} />}
                text="Documents"
                to="/documents"
                isActive={isActive("/documents")}
              />
              <SidebarItem
                icon={<Truck size={20} />}
                text="Resource Management"
                to="/resource"
                isActive={isActive("/fleet")}
              />
              <SidebarItem
                icon={<Navigation size={20} />}
                text="Tender"
                to="/tender"
                isActive={isActive("/vehicle")}
              /><SidebarItem
                icon={<ChartBar size={20} />}
                text="Reports"
                to="/report"
                isActive={isActive("/reports")}
              />
              <SidebarItem
                icon={<Settings size={20} />}
                text="Settings"
                to="/settings"
                isActive={isActive("/settings")}
              />
            </SidebarMenu>
          </SidebarContent>

          {/* Logout */}
          <SidebarFooter>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <button className="flex w-full items-center space-x-3">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
