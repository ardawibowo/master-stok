import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: number;
  name: string;
  totalDevices: number;
  status: "active" | "inactive";
}

export default function MasterBrand() {
  const { toast } = useToast();
  const [brands] = useState<Brand[]>([
    { id: 1, name: "Teltonika", totalDevices: 1243, status: "active" },
    { id: 2, name: "Queclink", totalDevices: 892, status: "active" },
    { id: 3, name: "Concox", totalDevices: 567, status: "active" },
    { id: 4, name: "Meitrack", totalDevices: 234, status: "inactive" },
  ]);

  const handleAddBrand = () => {
    toast({
      title: "Coming Soon",
      description: "Fitur tambah brand akan segera tersedia",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Brand</h2>
        <p className="text-muted-foreground">Kelola data brand perangkat GPS</p>
      </div>

      {/* Add New Brand Card */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle>Tambah Brand Baru</CardTitle>
          <CardDescription>Input data brand yang akan ditambahkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="brand-name">Nama Brand</Label>
              <Input id="brand-name" placeholder="e.g. Teltonika" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddBrand} className="bg-gradient-primary">
                <Tag className="mr-2 h-4 w-4" />
                Tambah Brand
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brands List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {brands.map((brand) => (
          <Card key={brand.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
                    <Tag className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <Badge 
                      variant={brand.status === "active" ? "default" : "secondary"}
                      className={brand.status === "active" ? "bg-success" : ""}
                    >
                      {brand.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Total Device</p>
                <p className="text-2xl font-bold text-status-warehouse">{brand.totalDevices}</p>
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
