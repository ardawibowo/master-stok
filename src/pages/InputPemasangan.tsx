import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Search, Calendar as CalendarIcon, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Device {
  id: number;
  serialNumber: string;
  brand: string;
  type: string;
  status: string;
  location: string;
}

export default function InputPemasangan() {
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().slice(0, 10));
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [accessories, setAccessories] = useState("");
  const [installDate, setInstallDate] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Mock data - devices in technician stock
  const technicianDevices: Device[] = [
    { id: 1, serialNumber: "SN3459182347", brand: "Teltonika", type: "FMB910", status: "di_teknisi", location: "Angga" },
    { id: 2, serialNumber: "SN8765432109", brand: "GT06", type: "GT06N", status: "di_teknisi", location: "Angga" },
    { id: 3, serialNumber: "SN2468135790", brand: "Dashcam", type: "1080p HD", status: "di_teknisi", location: "Bagus" },
    { id: 4, serialNumber: "SN9876543210", brand: "Concox", type: "AT4", status: "di_teknisi", location: "Bagus" },
    { id: 5, serialNumber: "SN1357924680", brand: "Teltonika", type: "FMB920", status: "di_teknisi", location: "Chandra" },
    { id: 6, serialNumber: "SN5432167890", brand: "GT06", type: "GT06N", status: "di_teknisi", location: "Chandra" },
  ];

  const technicians = ["Angga", "Bagus", "Chandra", "Doni", "Eko"];
  
  const customers = [
    { id: "CUST001", name: "PT Maju Jaya Transport" },
    { id: "CUST002", name: "CV Sejahtera Logistik" },
    { id: "CUST003", name: "UD Karya Mandiri" },
  ];

  const deviceTypes = ["FMB910", "FMB920", "GT06N", "AT4", "1080p HD", "4K Dashcam"];
  const accessoriesList = ["Kabel Power", "Mic External", "Relay", "Antena GPS", "Buzzer", "LED Indicator"];

  const filteredDevices = technicianDevices.filter((device) => {
    const matchesTechnician = device.location === selectedTechnician;
    const matchesSearch =
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTechnician && matchesSearch;
  });

  const handleDeviceToggle = (deviceId: number) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]
    );
  };

  const handleSubmit = () => {
    if (!selectedTechnician) {
      toast({
        title: "Error",
        description: "Pilih teknisi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (selectedDevices.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal 1 device untuk dipasang",
        variant: "destructive",
      });
      return;
    }

    if (!customerId || !customerName || !licensePlate || !deviceType) {
      toast({
        title: "Error",
        description: "Lengkapi data customer dan kendaraan",
        variant: "destructive",
      });
      return;
    }

    // Here would be the actual API call to update status to "terpasang"
    toast({
      title: "Berhasil!",
      description: `Pemasangan ${selectedDevices.length} device untuk customer ${customerName} berhasil dicatat`,
    });

    // Reset form
    setSelectedDevices([]);
    setCustomerId("");
    setCustomerName("");
    setLicensePlate("");
    setDeviceType("");
    setAccessories("");
    setNotes("");
    setInstallDate(new Date().toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Input Pemasangan</h2>
        <p className="text-muted-foreground">Ubah status device menjadi terpasang</p>
      </div>

      {/* Scheduling & Technician */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Penjadwalan</CardTitle>
            <CardDescription>Tentukan tanggal penjadwalan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Tanggal Jadwal</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Pilih Teknisi</CardTitle>
            <CardDescription>Stock device dari teknisi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Teknisi *</Label>
              <Select value={selectedTechnician} onValueChange={(value) => {
                setSelectedTechnician(value);
                setSelectedDevices([]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih teknisi" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Devices */}
      {selectedTechnician && (
        <>
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Device Tersedia dari {selectedTechnician}</CardTitle>
                  <CardDescription>
                    {filteredDevices.length} device • {selectedDevices.length} dipilih
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari device..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredDevices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Tidak ada device tersedia
                </p>
              ) : (
                filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => handleDeviceToggle(device.id)}
                    />
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div>
                        <p className="font-mono text-sm font-medium">{device.serialNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{device.brand}</p>
                        <p className="text-xs text-muted-foreground">{device.type}</p>
                      </div>
                      <div className="flex justify-end">
                        <Badge variant="outline">{device.location}</Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            </CardContent>
          </Card>

          {/* Customer & Vehicle Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Data Customer & Kendaraan</CardTitle>
              <CardDescription>Informasi pemasangan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ID Customer *</Label>
                  <Select value={customerId} onValueChange={(value) => {
                    setCustomerId(value);
                    const customer = customers.find(c => c.id === value);
                    if (customer) setCustomerName(customer.name);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.id} - {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nama Customer *</Label>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama customer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nomor Polisi *</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="B 1234 XYZ"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <div className="flex flex-wrap gap-2">
                  {deviceTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={deviceType === type ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setDeviceType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accessories</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {accessoriesList.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        const current = accessories.split(", ").filter(Boolean);
                        if (current.includes(item)) {
                          setAccessories(current.filter(a => a !== item).join(", "));
                        } else {
                          setAccessories([...current, item].join(", "));
                        }
                      }}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
                <Textarea
                  value={accessories}
                  onChange={(e) => setAccessories(e.target.value)}
                  placeholder="Pilih dari daftar atau ketik manual..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal & Waktu Pemasangan *</Label>
                <Input
                  type="datetime-local"
                  value={installDate}
                  onChange={(e) => setInstallDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Submit Button */}
      {selectedDevices.length > 0 && customerId && (
        <Card className="shadow-card bg-gradient-card">
          <CardContent className="pt-6">
            <Button onClick={handleSubmit} className="w-full bg-gradient-primary" size="lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              Konfirmasi Pemasangan ({selectedDevices.length} Device)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
