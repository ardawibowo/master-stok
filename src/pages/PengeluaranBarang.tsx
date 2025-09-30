import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Send, Trash2, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Device {
  serialNumber: string;
  brand: string;
  type: string;
  warehouse: string;
  status: string;
}

interface SelectedDevice extends Device {
  timestamp: string;
}

export default function PengeluaranBarang() {
  const { toast } = useToast();
  const [destinationType, setDestinationType] = useState<"warehouse" | "technician">("technician");
  const [destination, setDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);

  // Mock data - replace with actual data from backend
  const availableDevices: Device[] = [
    { serialNumber: "TLK001234567", brand: "Teltonika", type: "FMB910", warehouse: "Jakarta", status: "Di Gudang" },
    { serialNumber: "TLK001234568", brand: "Teltonika", type: "FMB920", warehouse: "Jakarta", status: "Di Gudang" },
    { serialNumber: "QCL002345678", brand: "Queclink", type: "GL300W", warehouse: "Jakarta", status: "Di Gudang" },
    { serialNumber: "TLK001234569", brand: "Teltonika", type: "FMB125", warehouse: "Surabaya", status: "Di Gudang" },
    { serialNumber: "CCX003456789", brand: "Concox", type: "GT06N", warehouse: "Surabaya", status: "Di Gudang" },
    { serialNumber: "QCL002345679", brand: "Queclink", type: "GV300", warehouse: "Jogja", status: "Di Gudang" },
  ];

  const filteredDevices = availableDevices.filter(device => {
    const matchesSearch = device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          device.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = !filterWarehouse || device.warehouse === filterWarehouse;
    const matchesBrand = !filterBrand || device.brand === filterBrand;
    const notSelected = !selectedDevices.find(d => d.serialNumber === device.serialNumber);
    
    return matchesSearch && matchesWarehouse && matchesBrand && notSelected;
  });

  const handleSelectDevice = (device: Device) => {
    if (!destination) {
      toast({
        title: "Error",
        description: "Pilih tujuan terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const selectedDevice: SelectedDevice = {
      ...device,
      timestamp: new Date().toLocaleString('id-ID'),
    };

    setSelectedDevices([...selectedDevices, selectedDevice]);
    
    toast({
      title: "Device Selected",
      description: `SN: ${device.serialNumber} ditambahkan`,
    });
  };

  const handleRemoveDevice = (index: number) => {
    setSelectedDevices(selectedDevices.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!destination) {
      toast({
        title: "Error",
        description: "Pilih tujuan terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (selectedDevices.length === 0) {
      toast({
        title: "Error",
        description: "Belum ada device yang dipilih",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save to backend and update status
    const destinationLabel = destinationType === "warehouse" 
      ? `Gudang ${destination}` 
      : destination;

    toast({
      title: "Berhasil",
      description: `${selectedDevices.length} device berhasil dikirim ke ${destinationLabel}`,
    });

    // Reset form
    setSelectedDevices([]);
    setDestination("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengeluaran Barang</h2>
        <p className="text-muted-foreground">Kirim perangkat ke warehouse atau teknisi</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Destination Selection */}
        <Card className="lg:col-span-1 shadow-card">
          <CardHeader>
            <CardTitle>Pilih Tujuan</CardTitle>
            <CardDescription>Tentukan tujuan pengiriman perangkat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination-type">Tipe Tujuan</Label>
              <Select value={destinationType} onValueChange={(value: "warehouse" | "technician") => {
                setDestinationType(value);
                setDestination("");
              }}>
                <SelectTrigger id="destination-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technician">Teknisi</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">
                {destinationType === "warehouse" ? "Warehouse Tujuan" : "Nama Teknisi"}
              </Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder={`Pilih ${destinationType === "warehouse" ? "Warehouse" : "Teknisi"}`} />
                </SelectTrigger>
                <SelectContent>
                  {destinationType === "warehouse" ? (
                    <>
                      <SelectItem value="Jakarta">Gudang Jakarta</SelectItem>
                      <SelectItem value="Surabaya">Gudang Surabaya</SelectItem>
                      <SelectItem value="Jogja">Gudang Jogja</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Angga">Angga</SelectItem>
                      <SelectItem value="Bagus">Bagus</SelectItem>
                      <SelectItem value="Chandra">Chandra</SelectItem>
                      <SelectItem value="Doni">Doni</SelectItem>
                      <SelectItem value="Eko">Eko</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {destination && (
              <div className="p-4 bg-gradient-card border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {destination[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{destinationType === "warehouse" ? `Gudang ${destination}` : destination}</p>
                    <Badge variant="secondary" className="text-xs">
                      {destinationType === "warehouse" ? "Warehouse" : "Teknisi"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Selection */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Pilih Perangkat</CardTitle>
            <CardDescription>Cari dan pilih perangkat yang akan dikirim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="grid gap-2 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari SN, Brand, Type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                  disabled={!destination}
                />
              </div>
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse} disabled={!destination}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Semua Warehouse</SelectItem>
                  <SelectItem value="Jakarta">Jakarta</SelectItem>
                  <SelectItem value="Surabaya">Surabaya</SelectItem>
                  <SelectItem value="Jogja">Jogja</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterBrand} onValueChange={setFilterBrand} disabled={!destination}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Semua Brand</SelectItem>
                  <SelectItem value="Teltonika">Teltonika</SelectItem>
                  <SelectItem value="Queclink">Queclink</SelectItem>
                  <SelectItem value="Concox">Concox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Available Devices */}
            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
              <p className="text-sm font-medium mb-2">Device Tersedia ({filteredDevices.length})</p>
              {!destination ? (
                <div className="text-center text-muted-foreground py-4">
                  <Filter className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Pilih tujuan terlebih dahulu</p>
                </div>
              ) : filteredDevices.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">Tidak ada device tersedia</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredDevices.map((device) => (
                    <div
                      key={device.serialNumber}
                      onClick={() => handleSelectDevice(device)}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{device.serialNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.brand} {device.type} - {device.warehouse}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">{device.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Devices */}
            <div className="border rounded-lg p-4 max-h-[250px] overflow-y-auto">
              <p className="text-sm font-medium mb-2">Device Terpilih ({selectedDevices.length})</p>
              {selectedDevices.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">Belum ada device yang dipilih</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{device.serialNumber}</p>
                          <Badge variant="outline" className="text-xs">{device.warehouse}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {device.brand} {device.type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDevice(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Total: <strong>{selectedDevices.length}</strong> device
              </p>
              <Button 
                onClick={handleSubmit} 
                className="bg-gradient-secondary"
                disabled={selectedDevices.length === 0 || !destination}
              >
                <Send className="mr-2 h-4 w-4" />
                Kirim Barang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
