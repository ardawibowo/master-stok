import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanBarcode, UserCheck, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AssignedDevice {
  serialNumber: string;
  brand: string;
  type: string;
  warehouse: string;
  timestamp: string;
}

export default function PengeluaranBarang() {
  const { toast } = useToast();
  const [technician, setTechnician] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [assignedDevices, setAssignedDevices] = useState<AssignedDevice[]>([]);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    if (!technician) {
      toast({
        title: "Error",
        description: "Pilih teknisi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    // TODO: Validate device exists and status is "Di Gudang"
    const mockDevice: AssignedDevice = {
      serialNumber: scanInput.trim(),
      brand: "Teltonika",
      type: "FMB910",
      warehouse: "Jakarta",
      timestamp: new Date().toLocaleString('id-ID'),
    };

    setAssignedDevices([...assignedDevices, mockDevice]);
    setScanInput("");
    
    toast({
      title: "Device Added",
      description: `SN: ${mockDevice.serialNumber} ditambahkan untuk ${technician}`,
    });
  };

  const handleRemoveDevice = (index: number) => {
    setAssignedDevices(assignedDevices.filter((_, i) => i !== index));
  };

  const handleAssign = () => {
    if (!technician) {
      toast({
        title: "Error",
        description: "Pilih teknisi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (assignedDevices.length === 0) {
      toast({
        title: "Error",
        description: "Belum ada device yang dipilih",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save to backend
    toast({
      title: "Berhasil",
      description: `${assignedDevices.length} device berhasil diserahkan ke ${technician}`,
    });

    // Reset form
    setAssignedDevices([]);
    setTechnician("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Pengeluaran Barang</h2>
        <p className="text-muted-foreground">Serahkan perangkat kepada teknisi</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Technician Selection */}
        <Card className="lg:col-span-1 shadow-card">
          <CardHeader>
            <CardTitle>Pilih Teknisi</CardTitle>
            <CardDescription>Teknisi yang akan menerima perangkat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Nama Teknisi</Label>
              <Select value={technician} onValueChange={setTechnician}>
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Pilih Teknisi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="angga">Angga</SelectItem>
                  <SelectItem value="bagus">Bagus</SelectItem>
                  <SelectItem value="chandra">Chandra</SelectItem>
                  <SelectItem value="doni">Doni</SelectItem>
                  <SelectItem value="eko">Eko</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {technician && (
              <div className="p-4 bg-gradient-card border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {technician[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{technician}</p>
                    <Badge variant="secondary" className="text-xs">Aktif</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scan Section */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Scan Perangkat</CardTitle>
            <CardDescription>Scan Serial Number perangkat yang akan diserahkan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScanSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Scan barcode Serial Number..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    disabled={!technician}
                    autoFocus={!!technician}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-gradient-primary"
                  disabled={!technician}
                >
                  <ScanBarcode className="mr-2 h-4 w-4" />
                  Scan
                </Button>
              </div>
            </form>

            <div className="mt-6 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
              {assignedDevices.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <UserCheck className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  <p>Belum ada device yang dipilih</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {assignedDevices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{device.serialNumber}</p>
                          <Badge variant="outline" className="text-xs">{device.warehouse}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {device.brand} {device.type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{device.timestamp}</p>
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

            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground">
                Total: <strong>{assignedDevices.length}</strong> device
              </p>
              <Button 
                onClick={handleAssign} 
                className="bg-gradient-secondary"
                disabled={assignedDevices.length === 0 || !technician}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Serahkan Barang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
