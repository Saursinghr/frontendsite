import { Toaster } from './components/ui/toaster'
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SiteDetail from "./pages/SiteDetail";
import LaborManagement from "./pages/LaborManagement";
import Tasks from "./pages/Tasks";
import TeamManagement from "./pages/TeamManagement";
import Procurement from "./pages/Procurement";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import SiteFinanceDetail from "./pages/SiteFinanceDetail.tsx";

const queryClient = new QueryClient();

const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/site/:id" element={<SiteDetail />} />
          <Route path="/attendance" element={<attendanceManagement />} />
          <Route path="/site/:id/labor" element={<LaborManagement />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/finance/site/:id" element={<SiteFinanceDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
