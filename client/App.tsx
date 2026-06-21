import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { HomePage } from "@/pages/user/HomePage";
import { NotFound } from "@/pages/NotFound";
import { ROUTES } from "@/lib/routes";

const queryClient = new QueryClient();

// Note: AdminDashboard already gates itself behind its own login screen
// (see the `authed` check inside pages/admin/AdminDashboard.tsx), so there's
// no separate "/admin/login" route, Layout, or RequireUser wrapper needed —
// those didn't exist in the project, which is why they were removed here.
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
