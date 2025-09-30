import { Package, Users, TrendingUp, Warehouse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  // Mock data - nanti akan diganti dengan data dari backend
  const stats = {
    totalStock: 1245,
    inTransit: 87,
    installed: 543,
    activeTechnicians: 12,
  };

  const warehouseStats = [
    { name: "Jakarta", stock: 456, inTransit: 34, installed: 210 },
    { name: "Surabaya", stock: 389, inTransit: 28, installed: 178 },
    { name: "Jogja", stock: 400, inTransit: 25, installed: 155 },
  ];

  const recentInstallations = [
    { technician: "Angga", device: "Teltonika FMB910", sn: "SN3459182347", date: "2025-09-29 15:30" },
    { technician: "Bagus", device: "GPS Tracker GT06", sn: "SN8765432109", date: "2025-09-29 14:15" },
    { technician: "Angga", device: "Dashcam 1080p", sn: "SN2468135790", date: "2025-09-29 11:45" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview sistem warehouse dan pemasangan</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <Package className="h-4 w-4 text-status-warehouse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">Perangkat di gudang</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Perjalanan</CardTitle>
            <Users className="h-4 w-4 text-status-transit" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Dibawa teknisi</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terpasang</CardTitle>
            <TrendingUp className="h-4 w-4 text-status-installed" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.installed}</div>
            <p className="text-xs text-muted-foreground">Berhasil dipasang</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teknisi Aktif</CardTitle>
            <Warehouse className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTechnicians}</div>
            <p className="text-xs text-muted-foreground">Sedang bertugas</p>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Stats */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Status Per Warehouse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {warehouseStats.map((warehouse) => (
              <div key={warehouse.name} className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border">
                <div>
                  <h4 className="font-semibold text-lg">{warehouse.name}</h4>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-status-warehouse">
                      <strong>{warehouse.stock}</strong> Stok
                    </span>
                    <span className="text-status-transit">
                      <strong>{warehouse.inTransit}</strong> Transit
                    </span>
                    <span className="text-status-installed">
                      <strong>{warehouse.installed}</strong> Terpasang
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {warehouse.stock + warehouse.inTransit + warehouse.installed}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Devices</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Installations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pemasangan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInstallations.map((install, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {install.technician[0]}
                  </div>
                  <div>
                    <p className="font-medium">{install.device}</p>
                    <p className="text-sm text-muted-foreground">SN: {install.sn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{install.technician}</p>
                  <p className="text-xs text-muted-foreground">{install.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
