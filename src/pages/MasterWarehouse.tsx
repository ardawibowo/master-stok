import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Package, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Warehouse {
  id: number;
  name: string;
  location: string;
  address: string;
  totalStock: number;
  capacity: number;
}

export default function MasterWarehouse() {
  const { toast } = useToast();
  const [warehouses] = useState<Warehouse[]>([
    {
      id: 1,
      name: "Gudang Jakarta",
      location: "Jakarta",
      address: "Jl. Raya Jakarta No. 123, Jakarta Selatan",
      totalStock: 456,
      capacity: 1000,
    },
    {
      id: 2,
      name: "Gudang Surabaya",
      location: "Surabaya",
      address: "Jl. Industri Raya No. 45, Surabaya",
      totalStock: 389,
      capacity: 800,
    },
    {
      id: 3,
      name: "Gudang Jogja",
      location: "Jogja",
      address: "Jl. Solo KM 10, Yogyakarta",
      totalStock: 400,
      capacity: 900,
    },
  ]);

  const handleAddWarehouse = () => {
    toast({
      title: "Coming Soon",
      description: "Fitur tambah warehouse akan segera tersedia",
    });
  };

  const getCapacityPercentage = (stock: number, capacity: number) => {
    return ((stock / capacity) * 100).toFixed(1);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 80) return "text-destructive";
    if (percentage >= 60) return "text-status-transit";
    return "text-status-installed";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Warehouse</h2>
        <p className="text-muted-foreground">Kelola data gudang dan lokasi</p>
      </div>

      {/* Add New Warehouse Card */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle>Tambah Warehouse Baru</CardTitle>
          <CardDescription>Input data gudang yang akan ditambahkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="warehouse-name">Nama Warehouse</Label>
              <Input id="warehouse-name" placeholder="e.g. Gudang Bandung" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Kota</Label>
              <Input id="location" placeholder="e.g. Bandung" />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input id="address" placeholder="Jl. Raya..." />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddWarehouse} className="w-full bg-gradient-primary">
                <Building2 className="mr-2 h-4 w-4" />
                Tambah Warehouse
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warehouses List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => {
          const percentage = parseFloat(getCapacityPercentage(warehouse.totalStock, warehouse.capacity));
          const colorClass = getCapacityColor(percentage);

          return (
            <Card key={warehouse.id} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {warehouse.location}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{warehouse.address}</span>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Stok Saat Ini</span>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-status-warehouse" />
                      <span className="text-xl font-bold">{warehouse.totalStock}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kapasitas</span>
                    <span className="text-sm font-medium">{warehouse.capacity} units</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Utilisasi</span>
                      <span className={`font-bold ${colorClass}`}>{percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage >= 80
                            ? "bg-destructive"
                            : percentage >= 60
                            ? "bg-status-transit"
                            : "bg-status-installed"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
