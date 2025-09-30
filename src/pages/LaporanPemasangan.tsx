import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

interface Installation {
  id: number;
  serialNumber: string;
  brand: string;
  type: string;
  technician: string;
  warehouse: string;
  installDate: string;
  dateOut: string;
}

export default function LaporanPemasangan() {
  const [selectedTechnician, setSelectedTechnician] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("2025-09");

  // Mock data
  const installations: Installation[] = [
    {
      id: 1,
      serialNumber: "SN3459182347",
      brand: "Teltonika",
      type: "FMB910",
      technician: "Angga",
      warehouse: "Jakarta",
      installDate: "2025-09-29 15:30",
      dateOut: "2025-09-29 09:00",
    },
    {
      id: 2,
      serialNumber: "SN8765432109",
      brand: "GT06",
      type: "GT06N",
      technician: "Bagus",
      warehouse: "Surabaya",
      installDate: "2025-09-29 14:15",
      dateOut: "2025-09-29 08:30",
    },
    {
      id: 3,
      serialNumber: "SN2468135790",
      brand: "Dashcam",
      type: "1080p HD",
      technician: "Angga",
      warehouse: "Jakarta",
      installDate: "2025-09-29 11:45",
      dateOut: "2025-09-28 16:00",
    },
    {
      id: 4,
      serialNumber: "SN9876543210",
      brand: "Concox",
      type: "AT4",
      technician: "Chandra",
      warehouse: "Jogja",
      installDate: "2025-09-28 16:20",
      dateOut: "2025-09-28 10:00",
    },
  ];

  const technicianStats = {
    angga: { total: 45, thisMonth: 12, avgTime: "4.5 jam" },
    bagus: { total: 38, thisMonth: 9, avgTime: "5.2 jam" },
    chandra: { total: 32, thisMonth: 8, avgTime: "4.8 jam" },
    doni: { total: 28, thisMonth: 7, avgTime: "5.0 jam" },
    eko: { total: 25, thisMonth: 6, avgTime: "4.7 jam" },
  };

  const currentStats = selectedTechnician === "all"
    ? { total: 168, thisMonth: 42 }
    : { 
        total: technicianStats[selectedTechnician as keyof typeof technicianStats].total,
        thisMonth: technicianStats[selectedTechnician as keyof typeof technicianStats].thisMonth,
      };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Laporan Pemasangan</h2>
        <p className="text-muted-foreground">Monitoring pemasangan per teknisi</p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Pilih teknisi dan periode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Teknisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Teknisi</SelectItem>
                  <SelectItem value="angga">Angga</SelectItem>
                  <SelectItem value="bagus">Bagus</SelectItem>
                  <SelectItem value="chandra">Chandra</SelectItem>
                  <SelectItem value="doni">Doni</SelectItem>
                  <SelectItem value="eko">Eko</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Object.entries(technicianStats).map(([name, stats]) => (
          <Card 
            key={name} 
            className={`shadow-card cursor-pointer transition-all hover:shadow-lg ${
              selectedTechnician === name ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTechnician(name)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {name[0].toUpperCase()}
                </div>
                <div>
                  <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
                  <p className="text-xs text-muted-foreground">Avg: {stats.avgTime}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-status-installed">{stats.thisMonth}</p>
                  <p className="text-xs text-muted-foreground">Bulan ini</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle>Total Pemasangan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold text-status-installed">{currentStats.thisMonth}</div>
              <div className="pb-2 text-muted-foreground">
                <p className="text-sm">Bulan ini</p>
                <p className="text-xs">dari {currentStats.total} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle>Rata-rata Waktu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold text-primary">4.8</div>
              <div className="pb-2 text-muted-foreground">
                <p className="text-sm">jam per instalasi</p>
                <p className="text-xs">Dari pengambilan hingga selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installation Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Riwayat Pemasangan</CardTitle>
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
                  <th className="text-left p-3 font-semibold">Tanggal Instalasi</th>
                  <th className="text-left p-3 font-semibold">Serial Number</th>
                  <th className="text-left p-3 font-semibold">Device</th>
                  <th className="text-left p-3 font-semibold">Teknisi</th>
                  <th className="text-left p-3 font-semibold">Warehouse</th>
                  <th className="text-left p-3 font-semibold">Waktu Kerja</th>
                </tr>
              </thead>
              <tbody>
                {installations.map((install) => {
                  const timeOut = new Date(install.dateOut);
                  const timeInstall = new Date(install.installDate);
                  const diffHours = Math.abs(timeInstall.getTime() - timeOut.getTime()) / 36e5;

                  return (
                    <tr key={install.id} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {install.installDate}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-sm">{install.serialNumber}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{install.brand}</p>
                          <p className="text-sm text-muted-foreground">{install.type}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                            {install.technician[0]}
                          </div>
                          <span className="font-medium">{install.technician}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{install.warehouse}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-success text-success-foreground">
                          {diffHours.toFixed(1)} jam
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
