import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScanBarcode, Upload, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScannedDevice {
  serialNumber: string;
  timestamp: string;
}

export default function InputBarang() {
  const { toast } = useToast();
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [scannedDevices, setScannedDevices] = useState<ScannedDevice[]>([]);
  const [scanInput, setScanInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;

    const newDevice: ScannedDevice = {
      serialNumber: scanInput.trim(),
      timestamp: new Date().toLocaleString('id-ID'),
    };

    setScannedDevices([...scannedDevices, newDevice]);
    setScanInput("");
    
    toast({
      title: "Device Scanned",
      description: `SN: ${newDevice.serialNumber} berhasil di-scan`,
    });
  };

  // Handle physical barcode scanner input (Enter key)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleScanSubmit(e as any);
    }
  };

  const handleRemoveDevice = (index: number) => {
    setScannedDevices(scannedDevices.filter((_, i) => i !== index));
  };

  const handleSaveAll = () => {
    if (!brand || !type || !category || !warehouse) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field Brand, Type, Category, dan Warehouse",
        variant: "destructive",
      });
      return;
    }

    if (scannedDevices.length === 0) {
      toast({
        title: "Error",
        description: "Belum ada device yang di-scan",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save to backend
    toast({
      title: "Berhasil",
      description: `${scannedDevices.length} device berhasil disimpan ke gudang ${warehouse}`,
    });

    // Reset form
    setScannedDevices([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Parse CSV and process
    toast({
      title: "File Uploaded",
      description: `File ${file.name} sedang diproses...`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Input Barang</h2>
        <p className="text-muted-foreground">Tambahkan perangkat baru ke gudang</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Form */}
        <Card className="lg:col-span-1 shadow-card">
          <CardHeader>
            <CardTitle>Informasi Perangkat</CardTitle>
            <CardDescription>Data umum untuk semua perangkat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Pilih Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teltonika">Teltonika</SelectItem>
                  <SelectItem value="gt06">GT06</SelectItem>
                  <SelectItem value="concox">Concox</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type/Model</Label>
              <Input
                id="type"
                placeholder="e.g. FMB910"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gps">GPS Tracker</SelectItem>
                  <SelectItem value="dashcam">Dashcam</SelectItem>
                  <SelectItem value="mdvr">MDVR</SelectItem>
                  <SelectItem value="acc">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={warehouse} onValueChange={setWarehouse}>
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Pilih Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jakarta">Jakarta</SelectItem>
                  <SelectItem value="surabaya">Surabaya</SelectItem>
                  <SelectItem value="jogja">Jogja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Scan/Upload Section */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Input Serial Number</CardTitle>
            <CardDescription>Gunakan barcode scanner atau upload CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scan">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">
                  <ScanBarcode className="mr-2 h-4 w-4" />
                  Scan Barcode
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="space-y-4">
                <form onSubmit={handleScanSubmit} className="flex gap-2">
                  <Input
                    placeholder="Scan barcode atau ketik Serial Number..."
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" className="bg-gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah
                  </Button>
                </form>

                <div className="border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {scannedDevices.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <ScanBarcode className="mx-auto h-12 w-12 mb-2 opacity-50" />
                      <p>Belum ada device yang di-scan</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {scannedDevices.map((device, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                          <div>
                            <p className="font-medium">{device.serialNumber}</p>
                            <p className="text-sm text-muted-foreground">{device.timestamp}</p>
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
                    Total: <strong>{scannedDevices.length}</strong> device
                  </p>
                  <Button 
                    onClick={handleSaveAll} 
                    className="bg-gradient-primary"
                    disabled={scannedDevices.length === 0}
                  >
                    Simpan ke Gudang
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload file CSV dengan format: Serial Number, Brand, Type, Category
                  </p>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                  <Button variant="link" className="mt-2">
                    Download Template CSV
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
