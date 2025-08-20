
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import SiteDetail from "./pages/SiteDetail";
import LaborManagement from "./pages/LaborManagement";
import { Tasks } from "./pages/Tasks";
import TeamManagement from "./pages/TeamManagement";
import Procurement from "./pages/Procurement";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import SiteFinanceDetail from "./pages/SiteFinanceDetail";
import Setting from "./pages/Setting";
import VehicaleTracker from "./pages/VehicaleTracker";
import ExtraFiannace from "./components/finance/ExtraFiannace";
import ResourceManagement from "./pages/ResourceManagement";
import Payroll from "./components/finance/Payroll";
import Report from "./pages/Report";
import Tender from "./pages/Tender";
import Documents from "./pages/document-upload";
import GalleryPage from "./pages/Gallery";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/site/:id" element={<SiteDetail />} />
              <Route path="/labor" element={<LaborManagement />} />
              <Route path="/labor/:id" element={<LaborManagement />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/:id" element={<Tasks />} />
              <Route path="/team" element={<TeamManagement />} />
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/procurement/:id" element={<Procurement />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inventory/:id" element={<Inventory />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/finance/payroll" element={<Payroll />} />
              <Route path="/finance/extra-finance" element={<ExtraFiannace />} />
              <Route path="/finance/site/:id" element={<SiteFinanceDetail />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/settings" element={<Setting/>}/>
              <Route path="/vehicaleTracker" element={<VehicaleTracker/>}/>
              <Route path="/resource" element={< ResourceManagement/>}/>
              <Route path="/report" element={<Report/>}/>
              <Route path="/tender" element={<Tender/>}/>
              <Route path="/documents" element={<Documents/>}/>
              <Route path="/documents/:id" element={<Documents/>}/>
              <Route path="/gallery" element={<GalleryPage/>}/>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
