
import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Package, 
  FileText, 
  Settings, 
  Truck, 
  Layers, 
  LogOut,
  Image
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Employee Management", icon: Users, path: "/labor" },
  { label: "Tasks & Schedule", icon: ClipboardList, path: "/tasksCalender" },
  { label: "Team Management", icon: Users, path: "/team" },
  { label: "Procurement", icon: FileText, path: "/procurement" },
  { label: "Inventory", icon: Package, path: "/inventory" },
  { label: "Gallery", icon: Image, path: "/gallery" },
  { 
    label: "Finance", 
    icon: Layers, 
    path: "/finance",
    children: [
      { label: "Payroll", path: "/finance/payroll" }
    ]
  },
  { label: "Documents", icon: FileText, path: "#" },
  { label: "Fleet Management", icon: Truck, path: "#" },
  { label: "Tender", icon: Truck, path: "/tender" },
  { label: "Reports", icon: Truck, path: "/reports" },
  { label: "Settings", icon: Settings, path: "#" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col bg-[#0f172a] text-white min-h-screen w-[250px] py-6 px-4 fixed left-0 top-0 z-40">
      <div className="mb-8 flex items-center h-10">
        <span className="text-xl font-extrabold tracking-tight text-blue-500">BuildTrack</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.label}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-base gap-3 transition-colors font-medium ${
                isActive || location.pathname === item.path
                  ? "bg-[#2563eb] text-white"
                  : "hover:bg-[#172554] hover:text-blue-300 text-gray-200"
              }`
            }
          >
            <item.icon size={20} /> <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold mt-8 text-red-200 hover:bg-[#172554] hover:text-red-400 transition-colors">
        <LogOut size={19} /> Logout
      </button>
    </aside>
  );
};

export default DashboardSidebar;
