import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Phone, Mail, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Technician {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  totalInstallations: number;
}

export default function MasterTeknisi() {
  const { toast } = useToast();
  const [technicians] = useState<Technician[]>([
    { id: 1, name: "Angga", phone: "081234567890", email: "angga@example.com", status: "active", totalInstallations: 45 },
    { id: 2, name: "Bagus", phone: "081234567891", email: "bagus@example.com", status: "active", totalInstallations: 38 },
    { id: 3, name: "Chandra", phone: "081234567892", email: "chandra@example.com", status: "active", totalInstallations: 32 },
    { id: 4, name: "Doni", phone: "081234567893", email: "doni@example.com", status: "inactive", totalInstallations: 28 },
    { id: 5, name: "Eko", phone: "081234567894", email: "eko@example.com", status: "active", totalInstallations: 25 },
  ]);

  const handleAddTechnician = () => {
    toast({
      title: "Coming Soon",
      description: "Fitur tambah teknisi akan segera tersedia",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Teknisi</h2>
        <p className="text-muted-foreground">Kelola data teknisi lapangan</p>
      </div>

      {/* Add New Technician Card */}
      <Card className="shadow-card bg-gradient-card">
        <CardHeader>
          <CardTitle>Tambah Teknisi Baru</CardTitle>
          <CardDescription>Input data teknisi yang akan ditambahkan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" placeholder="e.g. Budi Santoso" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input id="phone" placeholder="e.g. 081234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="e.g. budi@example.com" />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddTechnician} className="w-full bg-gradient-primary">
                <UserPlus className="mr-2 h-4 w-4" />
                Tambah Teknisi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technicians List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {technicians.map((tech) => (
          <Card key={tech.id} className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {tech.name[0]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tech.name}</CardTitle>
                    <Badge 
                      variant={tech.status === "active" ? "default" : "secondary"}
                      className={tech.status === "active" ? "bg-success" : ""}
                    >
                      {tech.status === "active" ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{tech.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{tech.email}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Total Pemasangan</p>
                <p className="text-2xl font-bold text-status-installed">{tech.totalInstallations}</p>
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
