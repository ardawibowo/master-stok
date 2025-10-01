import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import InputBarang from "./pages/InputBarang";
import PengeluaranBarang from "./pages/PengeluaranBarang";
import LaporanWarehouse from "./pages/LaporanWarehouse";
import LaporanPemasangan from "./pages/LaporanPemasangan";
import InputPemasangan from "./pages/InputPemasangan";
import MasterCustomer from "./pages/MasterCustomer";
import MasterTeknisi from "./pages/MasterTeknisi";
import MasterWarehouse from "./pages/MasterWarehouse";
import MasterBrand from "./pages/MasterBrand";
import MasterType from "./pages/MasterType";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/input-barang" element={<InputBarang />} />
          <Route path="/pengeluaran-barang" element={<PengeluaranBarang />} />
          <Route path="/laporan-warehouse" element={<LaporanWarehouse />} />
          <Route path="/laporan-pemasangan" element={<LaporanPemasangan />} />
          <Route path="/input-pemasangan" element={<InputPemasangan />} />
          <Route path="/master-customer" element={<MasterCustomer />} />
          <Route path="/master-teknisi" element={<MasterTeknisi />} />
            <Route path="/master-warehouse" element={<MasterWarehouse />} />
            <Route path="/master-brand" element={<MasterBrand />} />
            <Route path="/master-type" element={<MasterType />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
