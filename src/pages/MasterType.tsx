import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cpu, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeviceType {
  id: number;
  name: string;
  brand: string;
  totalDevices: number;
  status: "active" | "inactive";
}

export default function MasterType() {
  const { toast } = useToast();
  const [types] = useState<DeviceType[]>([
    { id: 1, name: "FMB910", brand: "Teltonika", totalDevices: 567, status: "active" },
    { id: 2, name: "FMB920", brand: "Teltonika", totalDevices: 445, status: "active" },
    { id: 3, name: "FMB125", brand: "Teltonika", totalDevices: 231, status: "active" },
    { id: 4, name: "GL300W", brand: "Queclink", totalDevices: 456, status: "active" },
    { id: 5, name: "GV300", brand: "Queclink", totalDevices: 436, status: "active" },
    { id: 6, name: "GT06N", brand: "Concox", totalDevices: 289, status: "inactive" },
  ]);

  const handleAddType = () => {
    toast({
      title: "Coming Soon",
      description: "Fitur tambah type akan segera tersedia",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Type</h2>
        <p className="text-muted-foreground">Kelola data tipe perangkat GPS</p>
      </div>

      {/* Add New Type Card */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle>Tambah Type Baru</CardTitle>
          <CardDescription>Input data tipe perangkat yang akan ditambahkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="type-brand">Brand</Label>
              <Select>
                <SelectTrigger id="type-brand">
                  <SelectValue placeholder="Pilih Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teltonika">Teltonika</SelectItem>
                  <SelectItem value="queclink">Queclink</SelectItem>
                  <SelectItem value="concox">Concox</SelectItem>
                  <SelectItem value="meitrack">Meitrack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type-name">Nama Type</Label>
              <Input id="type-name" placeholder="e.g. FMB910" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddType} className="w-full bg-gradient-primary">
                <Cpu className="mr-2 h-4 w-4" />
                Tambah Type
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {types.map((type) => (
          <Card key={type.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {type.brand}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={type.status === "active" ? "default" : "secondary"}
                  className={type.status === "active" ? "bg-success" : ""}
                >
                  {type.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Total Device</p>
                <p className="text-2xl font-bold text-status-warehouse">{type.totalDevices}</p>
              </div>
              <div className="flex gap-2 pt-2">
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
        ))}
      </div>
    </div>
  );
}
