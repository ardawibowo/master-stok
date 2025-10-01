import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Search, MapPin } from "lucide-react";
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
  const [sourceType, setSourceType] = useState<"warehouse" | "technician">("warehouse");
  const [selectedSource, setSelectedSource] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [installTechnician, setInstallTechnician] = useState("");
  const [installLocation, setInstallLocation] = useState("");
  const [installDate, setInstallDate] = useState(new Date().toISOString().slice(0, 16));
  const { toast } = useToast();

  // Mock data - devices available for installation
  const availableDevices: Device[] = [
    { id: 1, serialNumber: "SN3459182347", brand: "Teltonika", type: "FMB910", status: "di_teknisi", location: "Angga" },
    { id: 2, serialNumber: "SN8765432109", brand: "GT06", type: "GT06N", status: "ready", location: "Jakarta" },
    { id: 3, serialNumber: "SN2468135790", brand: "Dashcam", type: "1080p HD", status: "ready", location: "Surabaya" },
    { id: 4, serialNumber: "SN9876543210", brand: "Concox", type: "AT4", status: "di_teknisi", location: "Bagus" },
    { id: 5, serialNumber: "SN1357924680", brand: "Teltonika", type: "FMB920", status: "ready", location: "Jakarta" },
    { id: 6, serialNumber: "SN5432167890", brand: "GT06", type: "GT06N", status: "di_teknisi", location: "Chandra" },
  ];

  const warehouses = ["Jakarta", "Surabaya", "Jogja"];
  const technicians = ["Angga", "Bagus", "Chandra", "Doni", "Eko"];

  const filteredDevices = availableDevices.filter((device) => {
    const matchesSource =
      sourceType === "warehouse"
        ? device.status === "ready" && device.location === selectedSource
        : device.status === "di_teknisi" && device.location === selectedSource;
    const matchesSearch =
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleDeviceToggle = (deviceId: number) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]
    );
  };

  const handleSubmit = () => {
    if (selectedDevices.length === 0) {
      toast({
        title: "Error",
        description: "Pilih minimal 1 device untuk dipasang",
        variant: "destructive",
      });
      return;
    }

    if (!installTechnician || !installLocation) {
      toast({
        title: "Error",
        description: "Lengkapi data teknisi dan lokasi pemasangan",
        variant: "destructive",
      });
      return;
    }

    // Here would be the actual API call to update status to "terpasang"
    toast({
      title: "Berhasil!",
      description: `${selectedDevices.length} device berhasil diubah statusnya menjadi "Terpasang"`,
    });

    // Reset form
    setSelectedDevices([]);
    setInstallLocation("");
    setInstallDate(new Date().toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Input Pemasangan</h2>
        <p className="text-muted-foreground">Ubah status device menjadi terpasang</p>
      </div>

      {/* Source Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pilih Sumber Device</CardTitle>
          <CardDescription>Pilih dari warehouse atau stock teknisi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Sumber</Label>
              <Select value={sourceType} onValueChange={(value: "warehouse" | "technician") => {
                setSourceType(value);
                setSelectedSource("");
                setSelectedDevices([]);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="technician">Stock Teknisi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{sourceType === "warehouse" ? "Pilih Warehouse" : "Pilih Teknisi"}</Label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih ${sourceType === "warehouse" ? "warehouse" : "teknisi"}`} />
                </SelectTrigger>
                <SelectContent>
                  {(sourceType === "warehouse" ? warehouses : technicians).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSource && (
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari serial number, brand, atau type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Devices */}
      {selectedSource && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Device Tersedia</CardTitle>
            <CardDescription>
              {filteredDevices.length} device ditemukan • {selectedDevices.length} dipilih
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
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
      )}

      {/* Installation Details */}
      {selectedDevices.length > 0 && (
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle>Detail Pemasangan</CardTitle>
            <CardDescription>Lengkapi informasi pemasangan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Teknisi Pemasang *</Label>
                <Select value={installTechnician} onValueChange={setInstallTechnician}>
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

              <div>
                <Label>Tanggal & Waktu Pemasangan *</Label>
                <Input
                  type="datetime-local"
                  value={installDate}
                  onChange={(e) => setInstallDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Lokasi Pemasangan *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Pusat"
                  value={installLocation}
                  onChange={(e) => setInstallLocation(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

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
