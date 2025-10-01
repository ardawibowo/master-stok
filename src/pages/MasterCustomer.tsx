import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: number;
  customerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicles: number;
}

export default function MasterCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      customerId: "CUST001",
      name: "PT Maju Jaya Transport",
      phone: "021-12345678",
      email: "contact@majujaya.com",
      address: "Jl. Gatot Subroto No. 123, Jakarta",
      vehicles: 15,
    },
    {
      id: 2,
      customerId: "CUST002",
      name: "CV Sejahtera Logistik",
      phone: "031-87654321",
      email: "info@sejahtera.com",
      address: "Jl. Raya Darmo No. 456, Surabaya",
      vehicles: 8,
    },
    {
      id: 3,
      customerId: "CUST003",
      name: "UD Karya Mandiri",
      phone: "0274-765432",
      email: "karya@mandiri.com",
      address: "Jl. Malioboro No. 789, Jogja",
      vehicles: 5,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const { toast } = useToast();

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!formData.customerId || !formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "ID Customer, Nama, dan Telepon wajib diisi",
        variant: "destructive",
      });
      return;
    }

    if (editingCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? { ...c, ...formData }
            : c
        )
      );
      toast({
        title: "Berhasil",
        description: "Data customer berhasil diupdate",
      });
    } else {
      const newCustomer: Customer = {
        id: customers.length + 1,
        ...formData,
        vehicles: 0,
      };
      setCustomers([...customers, newCustomer]);
      toast({
        title: "Berhasil",
        description: "Customer baru berhasil ditambahkan",
      });
    }

    setIsDialogOpen(false);
    setEditingCustomer(null);
    setFormData({ customerId: "", name: "", phone: "", email: "", address: "" });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id));
    toast({
      title: "Berhasil",
      description: "Customer berhasil dihapus",
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
    setFormData({ customerId: "", name: "", phone: "", email: "", address: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Master Customer</h2>
        <p className="text-muted-foreground">Kelola data customer dan kendaraan</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Customer</CardTitle>
              <CardDescription>Total {customers.length} customer terdaftar</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary" onClick={handleDialogClose}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCustomer ? "Edit Customer" : "Tambah Customer Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    Lengkapi informasi customer di bawah ini
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerId">ID Customer *</Label>
                    <Input
                      id="customerId"
                      placeholder="CUST001"
                      value={formData.customerId}
                      onChange={(e) =>
                        setFormData({ ...formData, customerId: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Customer *</Label>
                    <Input
                      id="name"
                      placeholder="PT Maju Jaya"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telepon *</Label>
                    <Input
                      id="phone"
                      placeholder="021-12345678"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                      id="address"
                      placeholder="Jl. Contoh No. 123"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={handleDialogClose}>
                    Batal
                  </Button>
                  <Button onClick={handleSubmit} className="bg-gradient-primary">
                    {editingCustomer ? "Update" : "Simpan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Customer</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="text-center">Kendaraan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Tidak ada data customer
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono font-medium">
                        {customer.customerId}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{customer.phone}</p>
                          {customer.email && (
                            <p className="text-muted-foreground">{customer.email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {customer.address || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{customer.vehicles} unit</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
