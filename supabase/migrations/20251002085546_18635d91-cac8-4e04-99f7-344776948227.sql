-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'technician');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create types table
CREATE TABLE public.types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.types ENABLE ROW LEVEL SECURITY;

-- Create warehouses table
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  address TEXT,
  contact_person TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create technicians table
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  specialization TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;

-- Create devices table (inventory)
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT NOT NULL UNIQUE,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  type_id UUID REFERENCES public.types(id) ON DELETE SET NULL,
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'assigned', 'installed', 'returned', 'maintenance')),
  purchase_date DATE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

-- Create device_outbound table (pengeluaran barang)
CREATE TABLE public.device_outbound (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  outbound_date DATE NOT NULL DEFAULT CURRENT_DATE,
  purpose TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.device_outbound ENABLE ROW LEVEL SECURITY;

-- Create installations table
CREATE TABLE public.installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES public.technicians(id) ON DELETE SET NULL,
  installation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vehicle_plate TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  installation_address TEXT NOT NULL,
  accessories TEXT[],
  activation_code TEXT,
  notes TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_types_updated_at BEFORE UPDATE ON public.types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON public.warehouses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_installations_updated_at BEFORE UPDATE ON public.installations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for auto-creating profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for brands
CREATE POLICY "Authenticated users can view brands" ON public.brands
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and supervisors can manage brands" ON public.brands
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- RLS Policies for types
CREATE POLICY "Authenticated users can view types" ON public.types
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and supervisors can manage types" ON public.types
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- RLS Policies for warehouses
CREATE POLICY "Authenticated users can view warehouses" ON public.warehouses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and supervisors can manage warehouses" ON public.warehouses
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- RLS Policies for customers
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and supervisors can manage customers" ON public.customers
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- RLS Policies for technicians
CREATE POLICY "Authenticated users can view technicians" ON public.technicians
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and supervisors can manage technicians" ON public.technicians
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- RLS Policies for devices
CREATE POLICY "Authenticated users can view devices" ON public.devices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create devices" ON public.devices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins and supervisors can manage devices" ON public.devices
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Admins can delete devices" ON public.devices
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for device_outbound
CREATE POLICY "Authenticated users can view outbound records" ON public.device_outbound
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create outbound records" ON public.device_outbound
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins and supervisors can manage outbound records" ON public.device_outbound
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

-- RLS Policies for installations
CREATE POLICY "Authenticated users can view installations" ON public.installations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create installations" ON public.installations
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins and supervisors can manage installations" ON public.installations
  FOR UPDATE USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'supervisor')
  );

CREATE POLICY "Admins can delete installations" ON public.installations
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Insert dummy data for brands
INSERT INTO public.brands (name, description) VALUES
  ('Concox', 'GPS Tracker Brand - Concox'),
  ('Queclink', 'GPS Tracker Brand - Queclink'),
  ('Teltonika', 'GPS Tracker Brand - Teltonika'),
  ('Gosafe', 'GPS Tracker Brand - Gosafe'),
  ('Meitrack', 'GPS Tracker Brand - Meitrack');

-- Insert dummy data for types
INSERT INTO public.types (name, description) VALUES
  ('GT06N', 'Basic GPS Tracker Model'),
  ('GV500', 'Advanced GPS Tracker with Camera'),
  ('FMB920', 'Fleet Management GPS Tracker'),
  ('G737', 'Vehicle GPS Tracker'),
  ('MVT800', 'Motorcycle GPS Tracker');

-- Insert dummy data for warehouses
INSERT INTO public.warehouses (name, location, address, contact_person, phone) VALUES
  ('Gudang Pusat Jakarta', 'Jakarta', 'Jl. Sudirman No. 123, Jakarta Pusat', 'Budi Santoso', '021-12345678'),
  ('Gudang Surabaya', 'Surabaya', 'Jl. Basuki Rahmat No. 456, Surabaya', 'Siti Aminah', '031-87654321'),
  ('Gudang Bandung', 'Bandung', 'Jl. Asia Afrika No. 789, Bandung', 'Andi Wijaya', '022-11223344');

-- Insert dummy data for customers
INSERT INTO public.customers (name, phone, email, address, company) VALUES
  ('PT. Logistik Nusantara', '081234567890', 'logistik@nusantara.co.id', 'Jl. Gatot Subroto No. 100, Jakarta', 'PT. Logistik Nusantara'),
  ('CV. Trans Jaya', '081298765432', 'info@transjaya.com', 'Jl. Ahmad Yani No. 200, Surabaya', 'CV. Trans Jaya'),
  ('Ahmad Ridwan', '081222333444', 'ahmad.ridwan@gmail.com', 'Jl. Cihampelas No. 50, Bandung', 'Personal'),
  ('PT. Armada Express', '081555666777', 'armada@express.co.id', 'Jl. MT Haryono No. 300, Jakarta', 'PT. Armada Express'),
  ('Toko Sumber Rejeki', '081888999000', 'sumberrejeki@gmail.com', 'Jl. Diponegoro No. 75, Semarang', 'Toko Sumber Rejeki');

-- Insert dummy data for technicians
INSERT INTO public.technicians (name, phone, email, address, specialization, is_active) VALUES
  ('Joko Susanto', '081333444555', 'joko.tech@gmail.com', 'Jl. Mangga Besar No. 10, Jakarta', 'GPS Installation', true),
  ('Rini Pratiwi', '081666777888', 'rini.tech@gmail.com', 'Jl. Pahlawan No. 25, Surabaya', 'Vehicle Wiring', true),
  ('Dedi Kurniawan', '081999000111', 'dedi.tech@gmail.com', 'Jl. Merdeka No. 15, Bandung', 'GPS Configuration', true),
  ('Sari Wulandari', '081222111000', 'sari.tech@gmail.com', 'Jl. Pemuda No. 30, Semarang', 'GPS Installation', true);

-- Create indexes for better performance
CREATE INDEX idx_devices_serial_number ON public.devices(serial_number);
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_warehouse_id ON public.devices(warehouse_id);
CREATE INDEX idx_installations_customer_id ON public.installations(customer_id);
CREATE INDEX idx_installations_technician_id ON public.installations(technician_id);
CREATE INDEX idx_installations_device_id ON public.installations(device_id);
CREATE INDEX idx_installations_date ON public.installations(installation_date);
CREATE INDEX idx_device_outbound_device_id ON public.device_outbound(device_id);
CREATE INDEX idx_device_outbound_technician_id ON public.device_outbound(technician_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);