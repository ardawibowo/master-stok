-- =================================================================
-- WAREHOUSE GPS - DATABASE EXPORT FOR POSTGRESQL
-- =================================================================
-- File ini dapat dijalankan di PostgreSQL 12+ (lokal atau remote)
-- 
-- CARA MENGGUNAKAN:
-- 1. Buat database baru: CREATE DATABASE warehouse_gps;
-- 2. Jalankan file ini: psql -U postgres -d warehouse_gps -f database_export.sql
--
-- CATATAN:
-- - File ini TIDAK termasuk auth.users karena itu khusus Supabase
-- - Untuk testing lokal, Anda perlu membuat user manual di tabel profiles
-- =================================================================

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'technician');

-- =================================================================
-- TABLES
-- =================================================================

-- Create profiles table (untuk data user)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create types table
CREATE TABLE public.types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

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

-- =================================================================
-- FUNCTIONS & TRIGGERS
-- =================================================================

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

-- =================================================================
-- INDEXES FOR PERFORMANCE
-- =================================================================

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

-- =================================================================
-- DUMMY DATA
-- =================================================================

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

-- Insert dummy admin user for testing (ONLY FOR LOCALHOST)
-- Password hashing tidak disertakan karena ini untuk testing lokal
INSERT INTO public.profiles (full_name, email, phone) VALUES
  ('Admin System', 'admin@warehousegps.com', '081234567890');

-- Get the admin user ID and assign admin role
DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM public.profiles WHERE email = 'admin@warehousegps.com';
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin');
  END IF;
END $$;

-- Insert some dummy devices
DO $$
DECLARE
  brand_concox UUID;
  brand_queclink UUID;
  type_gt06n UUID;
  type_gv500 UUID;
  warehouse_jkt UUID;
  warehouse_sby UUID;
  admin_id UUID;
BEGIN
  -- Get IDs
  SELECT id INTO brand_concox FROM public.brands WHERE name = 'Concox';
  SELECT id INTO brand_queclink FROM public.brands WHERE name = 'Queclink';
  SELECT id INTO type_gt06n FROM public.types WHERE name = 'GT06N';
  SELECT id INTO type_gv500 FROM public.types WHERE name = 'GV500';
  SELECT id INTO warehouse_jkt FROM public.warehouses WHERE name = 'Gudang Pusat Jakarta';
  SELECT id INTO warehouse_sby FROM public.warehouses WHERE name = 'Gudang Surabaya';
  SELECT id INTO admin_id FROM public.profiles WHERE email = 'admin@warehousegps.com';

  -- Insert devices
  INSERT INTO public.devices (serial_number, brand_id, type_id, warehouse_id, status, purchase_date, created_by) VALUES
    ('GPS001-2025-001', brand_concox, type_gt06n, warehouse_jkt, 'in_stock', '2025-01-15', admin_id),
    ('GPS001-2025-002', brand_concox, type_gt06n, warehouse_jkt, 'in_stock', '2025-01-15', admin_id),
    ('GPS001-2025-003', brand_queclink, type_gv500, warehouse_sby, 'in_stock', '2025-01-20', admin_id),
    ('GPS001-2025-004', brand_queclink, type_gv500, warehouse_sby, 'assigned', '2025-01-20', admin_id),
    ('GPS001-2025-005', brand_concox, type_gt06n, warehouse_jkt, 'installed', '2025-01-10', admin_id);
END $$;

-- =================================================================
-- SELESAI
-- =================================================================

SELECT 'Database setup completed successfully!' AS status;
SELECT COUNT(*) AS total_brands FROM public.brands;
SELECT COUNT(*) AS total_types FROM public.types;
SELECT COUNT(*) AS total_warehouses FROM public.warehouses;
SELECT COUNT(*) AS total_customers FROM public.customers;
SELECT COUNT(*) AS total_technicians FROM public.technicians;
SELECT COUNT(*) AS total_devices FROM public.devices;
SELECT COUNT(*) AS total_profiles FROM public.profiles;
