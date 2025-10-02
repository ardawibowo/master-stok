# 📦 Panduan Instalasi Warehouse GPS System

## 🎯 Daftar Isi
1. [Prasyarat](#prasyarat)
2. [Instalasi Aplikasi](#instalasi-aplikasi)
3. [Setup Database PostgreSQL](#setup-database-postgresql)
4. [Setup Database MySQL (Alternatif)](#setup-database-mysql-alternatif)
5. [Konfigurasi Koneksi](#konfigurasi-koneksi)
6. [Menjalankan Aplikasi](#menjalankan-aplikasi)
7. [Login Pertama Kali](#login-pertama-kali)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Prasyarat

### Software yang Harus Diinstal:

1. **Node.js** (versi 18 atau lebih baru)
   - Download: https://nodejs.org/
   - Pilih versi LTS (Long Term Support)
   - Verifikasi instalasi:
     ```bash
     node --version
     npm --version
     ```

2. **Git** (untuk clone/download project)
   - Download: https://git-scm.com/
   - Verifikasi instalasi:
     ```bash
     git --version
     ```

3. **PostgreSQL** (versi 12 atau lebih baru)
   - **Windows**: https://www.postgresql.org/download/windows/
   - **macOS**: https://postgresapp.com/
   - **Linux**: 
     ```bash
     sudo apt-get install postgresql postgresql-contrib
     ```
   - Verifikasi instalasi:
     ```bash
     psql --version
     ```

4. **Code Editor** (opsional, tapi direkomendasikan)
   - Visual Studio Code: https://code.visualstudio.com/
   - Sublime Text: https://www.sublimetext.com/

---

## 📥 Instalasi Aplikasi

### 1. Download atau Clone Project

**Opsi A: Clone dari Git (jika ada repository)**
```bash
git clone [URL_REPOSITORY]
cd warehouse-gps
```

**Opsi B: Extract dari ZIP**
- Extract file ZIP ke folder pilihan Anda
- Buka terminal/command prompt di folder tersebut

### 2. Install Dependencies
```bash
npm install
```

Tunggu hingga proses instalasi selesai. Ini akan menginstall semua package yang diperlukan.

---

## 🗄️ Setup Database PostgreSQL

### 1. Buat Database Baru

**Cara 1: Menggunakan pgAdmin (GUI)**
1. Buka pgAdmin
2. Klik kanan pada "Databases" → "Create" → "Database"
3. Nama: `warehouse_gps`
4. Owner: `postgres`
5. Klik "Save"

**Cara 2: Menggunakan Terminal/Command Line**
```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE warehouse_gps;

# Keluar
\q
```

### 2. Import Database Schema

**Jalankan file database_export.sql:**

```bash
# Windows
psql -U postgres -d warehouse_gps -f database_export.sql

# macOS/Linux
psql -U postgres -d warehouse_gps -f database_export.sql
```

**Jika diminta password**, masukkan password PostgreSQL Anda.

### 3. Verifikasi Database

```bash
# Login ke database
psql -U postgres -d warehouse_gps

# Cek tabel yang sudah dibuat
\dt

# Lihat data dummy
SELECT * FROM public.brands;
SELECT * FROM public.profiles;

# Keluar
\q
```

Anda seharusnya melihat:
- 11 tabel (profiles, user_roles, brands, types, warehouses, customers, technicians, devices, device_outbound, installations)
- Data dummy untuk brands (5 data)
- Data dummy untuk types (5 data)
- Data dummy untuk warehouses (3 data)
- Data dummy untuk customers (5 data)
- Data dummy untuk technicians (4 data)
- Data dummy untuk devices (5 data)
- 1 user admin untuk testing

---

## 🔄 Setup Database MySQL (Alternatif)

Jika Anda ingin menggunakan MySQL instead of PostgreSQL:

### 1. Install MySQL
- **Windows**: https://dev.mysql.com/downloads/installer/
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### 2. Konversi Script PostgreSQL ke MySQL

Beberapa penyesuaian yang perlu dilakukan:

```sql
-- MySQL tidak support UUID secara default, gunakan CHAR(36) atau VARCHAR(36)
-- Ganti gen_random_uuid() dengan UUID()
-- Ganti TIMESTAMP WITH TIME ZONE dengan DATETIME atau TIMESTAMP
-- Ganti TEXT[] (array) dengan JSON atau TEXT

-- Contoh konversi:
CREATE TABLE brands (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. Import ke MySQL
```bash
mysql -u root -p warehouse_gps < database_export_mysql.sql
```

---

## ⚙️ Konfigurasi Koneksi

### Opsi 1: Menggunakan Supabase (Sudah Terkonfigurasi)

Aplikasi ini sudah terhubung ke Supabase project "warehouse GPS":
- Project URL: `https://cdlnjlhzqqmvuvysqlqj.supabase.co`
- Tidak perlu konfigurasi tambahan
- Langsung bisa digunakan

### Opsi 2: Menggunakan Database Lokal

Jika ingin connect ke PostgreSQL lokal, Anda perlu:

1. **Buat file koneksi database** di `src/integrations/supabase/client-local.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

// Untuk localhost PostgreSQL
const LOCAL_DB_URL = "http://localhost:54321"; // atau port PostgreSQL Anda
const LOCAL_DB_KEY = "your-anon-key"; // generate dari Supabase local

export const supabaseLocal = createClient(LOCAL_DB_URL, LOCAL_DB_KEY);
```

2. **Update import** di file-file yang menggunakan database untuk menggunakan `supabaseLocal` instead of `supabase`.

**CATATAN PENTING**: 
- Aplikasi saat ini menggunakan Supabase Auth untuk authentication
- Untuk localhost, Anda perlu setup authentication sendiri atau disable auth checks sementara
- RLS (Row Level Security) policies tidak akan berfungsi di PostgreSQL standalone

---

## 🚀 Menjalankan Aplikasi

### 1. Start Development Server

```bash
npm run dev
```

### 2. Akses Aplikasi

Buka browser dan akses:
```
http://localhost:8080
```

Aplikasi akan otomatis reload ketika Anda melakukan perubahan code.

### 3. Build untuk Production (Opsional)

```bash
# Build aplikasi
npm run build

# Preview production build
npm run preview
```

---

## 🔐 Login Pertama Kali

### Data Login Default (untuk testing):

**User Admin:**
- Email: `admin@warehousegps.com`
- Password: *Belum ada (Supabase Auth)*

**Cara membuat user pertama:**

1. **Jika menggunakan Supabase:**
   - Buka Supabase Dashboard: https://supabase.com/dashboard/project/cdlnjlhzqqmvuvysqlqj
   - Masuk ke menu "Authentication" → "Users"
   - Klik "Add User" → "Create new user"
   - Masukkan email dan password
   - User akan otomatis dibuat di tabel `profiles`

2. **Jika menggunakan PostgreSQL Lokal:**
   - Data admin sudah ada di database dengan email: `admin@warehousegps.com`
   - Anda perlu implement authentication sendiri atau bypass auth checks

### Menambah Role ke User:

```sql
-- Login ke PostgreSQL
psql -U postgres -d warehouse_gps

-- Dapatkan user_id dari profiles
SELECT id, email FROM public.profiles;

-- Tambahkan role (ganti <user_id> dengan UUID yang sesuai)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('<user_id>', 'admin');

-- Verifikasi
SELECT p.email, ur.role 
FROM public.profiles p 
JOIN public.user_roles ur ON p.id = ur.user_id;
```

---

## 🔍 Troubleshooting

### Problem: `npm install` gagal

**Solusi:**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### Problem: Port 8080 sudah digunakan

**Solusi:**
Edit `vite.config.ts` dan ubah port:
```typescript
server: {
  host: "::",
  port: 3000, // Ganti dengan port lain
}
```

### Problem: Tidak bisa connect ke database

**Cek koneksi PostgreSQL:**
```bash
# Test koneksi
psql -U postgres -d warehouse_gps -c "SELECT version();"

# Cek apakah PostgreSQL berjalan
# Windows:
services.msc (cari "postgresql")

# macOS:
brew services list

# Linux:
sudo systemctl status postgresql
```

### Problem: Database error "relation does not exist"

**Solusi:**
Database belum di-import. Jalankan ulang:
```bash
psql -U postgres -d warehouse_gps -f database_export.sql
```

### Problem: Authentication tidak berfungsi

**Untuk Supabase:**
- Pastikan Anda terhubung ke internet
- Cek Supabase Dashboard untuk melihat status project

**Untuk Localhost:**
- Authentication dengan Supabase Auth tidak akan work untuk localhost
- Anda perlu implement custom authentication atau disable auth checks

### Problem: Data tidak muncul di aplikasi

**Kemungkinan penyebab:**
1. RLS (Row Level Security) policies memblokir akses
2. User belum login
3. User tidak memiliki role yang sesuai

**Solusi:**
```sql
-- Temporary: Disable RLS untuk testing
ALTER TABLE public.brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.types DISABLE ROW LEVEL SECURITY;
-- dst...

-- JANGAN LAKUKAN INI DI PRODUCTION!
```

---

## 📊 Struktur Database

```
warehouse_gps/
├── profiles           (Data user/pengguna)
├── user_roles         (Role user: admin, supervisor, technician)
├── brands            (Master brand GPS)
├── types             (Master tipe GPS)
├── warehouses        (Master gudang)
├── customers         (Data pelanggan)
├── technicians       (Data teknisi)
├── devices           (Inventory perangkat GPS)
├── device_outbound   (Pengeluaran barang)
└── installations     (Data pemasangan GPS)
```

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:

1. **Cek Console Browser** (F12) untuk error messages
2. **Cek Terminal** untuk error dari server
3. **Cek PostgreSQL logs** untuk database errors
4. **Buka Issue** di repository project (jika ada)

---

## ✅ Checklist Setup

- [ ] Node.js terinstal (v18+)
- [ ] PostgreSQL terinstal (v12+)
- [ ] Database `warehouse_gps` sudah dibuat
- [ ] File `database_export.sql` sudah di-import
- [ ] `npm install` berhasil dijalankan
- [ ] Aplikasi bisa diakses di `http://localhost:8080`
- [ ] Data dummy muncul di database
- [ ] User admin sudah dibuat
- [ ] Bisa login ke aplikasi

---

**Selamat! Aplikasi Warehouse GPS System siap digunakan! 🎉**
