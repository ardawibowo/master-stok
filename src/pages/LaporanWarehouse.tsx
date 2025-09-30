import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search, Filter } from "lucide-react";

interface Device {
  id: number;
  serialNumber: string;
  brand: string;
  type: string;
  category: string;
  status: "Di Gudang" | "Dibawa Teknisi" | "Terpasang";
  dateIn: string;
  dateOut?: string;
  technician?: string;
}

export default function LaporanWarehouse() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const devices: Device[] = [
    {
      id: 1,
      serialNumber: "SN3459182347",
      brand: "Teltonika",
      type: "FMB910",
      category: "GPS",
      status: "Terpasang",
      dateIn: "2025-09-20",
      dateOut: "2025-09-25",
      technician: "Angga",
    },
    {
      id: 2,
      serialNumber: "SN8765432109",
      brand: "GT06",
      type: "GT06N",
      category: "GPS",
      status: "Dibawa Teknisi",
      dateIn: "2025-09-22",
      dateOut: "2025-09-28",
      technician: "Bagus",
    },
    {
      id: 3,
      serialNumber: "SN2468135790",
      brand: "Concox",
      type: "AT4",
      category: "GPS",
      status: "Di Gudang",
      dateIn: "2025-09-25",
    },
  ];

  const getStatusBadge = (status: Device["status"]) => {
    const variants: Record<Device["status"], string> = {
      "Di Gudang": "bg-status-warehouse text-white",
      "Dibawa Teknisi": "bg-status-transit text-white",
      "Terpasang": "bg-status-installed text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const warehouseStats = {
    jakarta: { total: 456, diGudang: 389, transit: 34, terpasang: 33 },
    surabaya: { total: 389, diGudang: 312, transit: 28, terpasang: 49 },
    jogja: { total: 400, diGudang: 345, transit: 25, terpasang: 30 },
  };

  const currentStats = selectedWarehouse === "all" 
    ? {
        total: 1245,
        diGudang: 1046,
        transit: 87,
        terpasang: 112,
      }
    : selectedWarehouse === "jakarta"
    ? warehouseStats.jakarta
    : selectedWarehouse === "surabaya"
    ? warehouseStats.surabaya
    : warehouseStats.jogja;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Laporan Warehouse</h2>
        <p className="text-muted-foreground">Monitoring stok dan status perangkat per gudang</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Pilih warehouse dan filter status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Warehouse</SelectItem>
                  <SelectItem value="jakarta">Jakarta</SelectItem>
                  <SelectItem value="surabaya">Surabaya</SelectItem>
                  <SelectItem value="jogja">Jogja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="digudang">Di Gudang</SelectItem>
                  <SelectItem value="transit">Dibawa Teknisi</SelectItem>
                  <SelectItem value="terpasang">Terpasang</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari Serial Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentStats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-status-warehouse">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Di Gudang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-warehouse">{currentStats.diGudang}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-status-transit">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dibawa Teknisi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-transit">{currentStats.transit}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-status-installed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terpasang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-installed">{currentStats.terpasang}</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Perangkat</CardTitle>
            <Button className="bg-gradient-primary">
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Serial Number</th>
                  <th className="text-left p-3 font-semibold">Brand</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Tanggal Masuk</th>
                  <th className="text-left p-3 font-semibold">Teknisi</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-accent/50 transition-colors">
                    <td className="p-3 font-mono text-sm">{device.serialNumber}</td>
                    <td className="p-3">{device.brand}</td>
                    <td className="p-3">{device.type}</td>
                    <td className="p-3">
                      <Badge variant="outline">{device.category}</Badge>
                    </td>
                    <td className="p-3">{getStatusBadge(device.status)}</td>
                    <td className="p-3 text-sm text-muted-foreground">{device.dateIn}</td>
                    <td className="p-3">
                      {device.technician ? (
                        <span className="font-medium">{device.technician}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
