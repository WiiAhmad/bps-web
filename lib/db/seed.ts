import 'dotenv/config';
import { db } from './drizzle';
import { 
  usersTable,
  tableMFD,
  tableKeluarga,
  tableKetPetugas,
  tableAnggotaKeluarga,
  tableKetenagakerjaan,
  tableKeteranganPerumahan,
  tableKeteranganPerumahanBlok2,
  tableBantuan,
  tableDisabilitas
} from './schema';

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data in reverse dependency order
    console.log('🧹 Clearing existing data...');
    await db.delete(tableDisabilitas);
    await db.delete(tableBantuan);
    await db.delete(tableKeteranganPerumahanBlok2);
    await db.delete(tableKeteranganPerumahan);
    await db.delete(tableKetenagakerjaan);
    await db.delete(tableAnggotaKeluarga);
    await db.delete(tableKetPetugas);
    await db.delete(tableKeluarga);
    await db.delete(tableMFD);
    await db.delete(usersTable);
    console.log('✅ Existing data cleared');

    // 1. Seed Users (base table - no dependencies)
    console.log('👥 Seeding users...');
    const users = await db.insert(usersTable).values([
      {
        nama: 'Ahmad Sutrisno',
        email: 'ahmad.sutrisno@email.com',
        username: 'ahmad_admin',
        password: 'hashed_password_123',
        photo: 'photos/ahmad.jpg',
        tanggal_lahir: new Date('1985-05-15').toISOString(),
        NoTelpon: '081234567890',
        role: 'admin',
        alamat: 'Jl. Veteran No. 123, Jakarta Pusat',
        isVerified: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: 0,
      },
      {
        nama: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@email.com',
        username: 'siti_petugas',
        password: 'hashed_password_456',
        photo: 'photos/siti.jpg',
        tanggal_lahir: new Date('1990-08-22').toISOString(),
        NoTelpon: '081234567891',
        role: 'petugas',
        alamat: 'Jl. Sudirman No. 456, Jakarta Selatan',
        isVerified: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: 0,
      },
      {
        nama: 'Budi Santoso',
        email: 'budi.santoso@email.com',
        username: 'budi_petugas',
        password: 'hashed_password_789',
        photo: 'photos/budi.jpg',
        tanggal_lahir: new Date('1988-12-10').toISOString(),
        NoTelpon: '081234567892',
        role: 'petugas',
        alamat: 'Jl. Thamrin No. 789, Jakarta Pusat',
        isVerified: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: 0,
      },
      {
        nama: 'Rina Marlina',
        email: 'rina.marlina@email.com',
        username: 'rina_pemeriksa',
        password: 'hashed_password_101',
        photo: 'photos/rina.jpg',
        tanggal_lahir: new Date('1992-03-18').toISOString(),
        NoTelpon: '081234567893',
        role: 'pemeriksa',
        alamat: 'Jl. Gatot Subroto No. 321, Jakarta Selatan',
        isVerified: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deleted: 0,
      },
    ]).returning();
    console.log(`✅ Created ${users.length} users`);

    // 2. Seed MFD (Master File Desa - geographic data)
    console.log('🗺️ Seeding MFD data...');
    const mfdRecords = await db.insert(tableMFD).values([
      {
        namaProvinsi: 'DKI Jakarta',
        kodeProvinsi: '31',
        namaKabupaten: 'Jakarta Pusat',
        kodeKabupaten: '3101',
        namaKecamatan: 'Gambir',
        kodeKecamatan: '310101',
        namaDesa: 'Gambir',
        kodeDesa: '310101001',
        namaDusun: 'Dusun 1',
        kodeDusun: '001',
        namaSLS: 'SLS 001',
        kodeSLS: '001',
        namaSubSLS: 'Sub SLS 001',
        kodeSubSLS: '001',
      },
      {
        namaProvinsi: 'DKI Jakarta',
        kodeProvinsi: '31',
        namaKabupaten: 'Jakarta Selatan',
        kodeKabupaten: '3102',
        namaKecamatan: 'Kebayoran Baru',
        kodeKecamatan: '310201',
        namaDesa: 'Kebayoran Baru',
        kodeDesa: '310201001',
        namaDusun: 'Dusun 1',
        kodeDusun: '001',
        namaSLS: 'SLS 002',
        kodeSLS: '002',
        namaSubSLS: 'Sub SLS 002',
        kodeSubSLS: '002',
      },
      {
        namaProvinsi: 'DKI Jakarta',
        kodeProvinsi: '31',
        namaKabupaten: 'Jakarta Barat',
        kodeKabupaten: '3103',
        namaKecamatan: 'Taman Sari',
        kodeKecamatan: '310301',
        namaDesa: 'Taman Sari',
        kodeDesa: '310301001',
        namaDusun: 'Dusun 1',
        kodeDusun: '001',
        namaSLS: 'SLS 003',
        kodeSLS: '003',
        namaSubSLS: 'Sub SLS 003',
        kodeSubSLS: '003',
      },
    ]).returning();
    console.log(`✅ Created ${mfdRecords.length} MFD records`);

    // 3. Seed Keluarga (depends on MFD)
    console.log('👨‍👩‍👧‍👦 Seeding families...');
    const keluarga = await db.insert(tableKeluarga).values([
      {
        namaKepalaKeluarga: 'Joko Susilo',
        anggotaKeluarga: 4,
        nomorKartuKeluarga: '3171012345678901',
        alamat: 'Jl. Veteran RT 001/001',
        idMFD: mfdRecords[0].id,
        catatan: 'Keluarga lengkap',
      },
      {
        namaKepalaKeluarga: 'Maya Sari',
        anggotaKeluarga: 3,
        nomorKartuKeluarga: '3171012345678902',
        alamat: 'Jl. Sudirman RT 002/001',
        idMFD: mfdRecords[1].id,
        catatan: 'Keluarga young couple',
      },
      {
        namaKepalaKeluarga: 'Andi Wijaya',
        anggotaKeluarga: 5,
        nomorKartuKeluarga: '3171012345678903',
        alamat: 'Jl. Thamrin RT 003/001',
        idMFD: mfdRecords[2].id,
        catatan: 'Keluarga extended family',
      },
      {
        namaKepalaKeluarga: 'Sari Dewi',
        anggotaKeluarga: 2,
        nomorKartuKeluarga: '3171012345678904',
        alamat: 'Jl. Gatot Subroto RT 004/001',
        idMFD: mfdRecords[0].id,
        catatan: 'Elderly couple',
      },
    ]).returning();
    console.log(`✅ Created ${keluarga.length} families`);

    // 4. Seed KetPetugas (depends on users and keluarga)
    console.log('📋 Seeding officer records...');
    const ketPetugas = await db.insert(tableKetPetugas).values([
      {
        tanggalPendataan: new Date('2024-01-15').toISOString(),
        namaPendata: 'Siti Nurhaliza',
        kodePendata: users[1].id, // siti
        tanggalPemeriksaan: new Date('2024-01-20').toISOString(),
        namaPemeriksa: 'Rina Marlina',
        kodePemeriksa: users[3].id, // rina
        hasilPendataan: 'Lengkap',
        idKeluarga: keluarga[0].id,
      },
      {
        tanggalPendataan: new Date('2024-01-16').toISOString(),
        namaPendata: 'Budi Santoso',
        kodePendata: users[2].id, // budi
        tanggalPemeriksaan: new Date('2024-01-21').toISOString(),
        namaPemeriksa: 'Rina Marlina',
        kodePemeriksa: users[3].id, // rina
        hasilPendataan: 'Lengkap',
        idKeluarga: keluarga[1].id,
      },
      {
        tanggalPendataan: new Date('2024-01-17').toISOString(),
        namaPendata: 'Siti Nurhaliza',
        kodePendata: users[1].id, // siti
        tanggalPemeriksaan: new Date('2024-01-22').toISOString(),
        namaPemeriksa: 'Ahmad Sutrisno',
        kodePemeriksa: users[0].id, // ahmad
        hasilPendataan: 'Lengkap',
        idKeluarga: keluarga[2].id,
      },
    ]).returning();
    console.log(`✅ Created ${ketPetugas.length} officer records`);

    // 5. Seed AnggotaKeluarga (depends on keluarga)
    console.log('👤 Seeding family members...');
    const anggotaKeluarga = await db.insert(tableAnggotaKeluarga).values([
      // Family 1 (Joko Susilo)
      { idKeluarga: keluarga[0].id, nomorUrut: 1, namaLengkap: 'Joko Susilo', NIK: '3171010101010001', jenisKelamin: 1, hubunganKeluarga: 1, statusKawin: 1, tempatLahir: 'Jakarta', tanggalLahir: new Date('1980-05-10').toISOString(), umur: 44, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 6, kelasTertinggi: 12, ijazahTertinggi: 3 },
      { idKeluarga: keluarga[0].id, nomorUrut: 2, namaLengkap: 'Sari Rahayu', NIK: '3171010101010002', jenisKelamin: 2, hubunganKeluarga: 2, statusKawin: 1, tempatLahir: 'Jakarta', tanggalLahir: new Date('1982-08-15').toISOString(), umur: 42, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 5, kelasTertinggi: 9, ijazahTertinggi: 2 },
      { idKeluarga: keluarga[0].id, nomorUrut: 3, namaLengkap: 'Budi Susilo', NIK: '3171010101010003', jenisKelamin: 1, hubunganKeluarga: 3, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('2005-12-20').toISOString(), umur: 19, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 1, tingkatPendidikan: 4, kelasTertinggi: 12, ijazahTertinggi: 1 },
      { idKeluarga: keluarga[0].id, nomorUrut: 4, namaLengkap: 'Ani Susilo', NIK: '3171010101010004', jenisKelamin: 2, hubunganKeluarga: 3, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('2008-03-25').toISOString(), umur: 16, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 1, tingkatPendidikan: 3, kelasTertinggi: 10, ijazahTertinggi: 0 },
      
      // Family 2 (Maya Sari)
      { idKeluarga: keluarga[1].id, nomorUrut: 1, namaLengkap: 'Maya Sari', NIK: '3171010101010005', jenisKelamin: 2, hubunganKeluarga: 1, statusKawin: 1, tempatLahir: 'Jakarta', tanggalLahir: new Date('1995-07-12').toISOString(), umur: 29, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 5, kelasTertinggi: 9, ijazahTertinggi: 2 },
      { idKeluarga: keluarga[1].id, nomorUrut: 2, namaLengkap: 'Dedi Pratama', NIK: '3171010101010006', jenisKelamin: 1, hubunganKeluarga: 2, statusKawin: 1, tempatLahir: 'Jakarta', tanggalLahir: new Date('1993-11-18').toISOString(), umur: 31, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 6, kelasTertinggi: 12, ijazahTertinggi: 3 },
      { idKeluarga: keluarga[1].id, nomorUrut: 3, namaLengkap: 'Rizki Pratama', NIK: '3171010101010007', jenisKelamin: 1, hubunganKeluarga: 3, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('2020-04-10').toISOString(), umur: 4, agama: 1, kartuIdentitas: 2, domisili: 1, partisipasiSekolah: 1, tingkatPendidikan: 0, kelasTertinggi: 0, ijazahTertinggi: 0 },
      
      // Family 3 (Andi Wijaya)
      { idKeluarga: keluarga[2].id, nomorUrut: 1, namaLengkap: 'Andi Wijaya', NIK: '3171010101010008', jenisKelamin: 1, hubunganKeluarga: 1, statusKawin: 1, tempatLahir: 'Jakarta', tanggalLahir: new Date('1975-09-08').toISOString(), umur: 49, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 6, kelasTertinggi: 12, ijazahTertinggi: 3 },
      { idKeluarga: keluarga[2].id, nomorUrut: 2, namaLengkap: 'Linda Sari', NIK: '3171010101010009', jenisKelamin: 2, hubunganKeluarga: 2, statusKawin: 1, tempatLahir: 'Jakarta', tanggalLahir: new Date('1978-01-15').toISOString(), umur: 47, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 5, kelasTertinggi: 9, ijazahTertinggi: 2 },
      { idKeluarga: keluarga[2].id, nomorUrut: 3, namaLengkap: 'Riko Wijaya', NIK: '3171010101010010', jenisKelamin: 1, hubunganKeluarga: 3, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('2002-06-20').toISOString(), umur: 22, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 4, kelasTertinggi: 12, ijazahTertinggi: 1 },
      { idKeluarga: keluarga[2].id, nomorUrut: 4, namaLengkap: 'Sinta Wijaya', NIK: '3171010101010011', jenisKelamin: 2, hubunganKeluarga: 3, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('2004-11-12').toISOString(), umur: 20, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 4, kelasTertinggi: 12, ijazahTertinggi: 1 },
      { idKeluarga: keluarga[2].id, nomorUrut: 5, namaLengkap: 'Dodi Wijaya', NIK: '3171010101010012', jenisKelamin: 1, hubunganKeluarga: 3, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('2007-02-28').toISOString(), umur: 17, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 1, tingkatPendidikan: 3, kelasTertinggi: 11, ijazahTertinggi: 0 },
      
      // Family 4 (Sari Dewi)
      { idKeluarga: keluarga[3].id, nomorUrut: 1, namaLengkap: 'Sari Dewi', NIK: '3171010101010013', jenisKelamin: 2, hubunganKeluarga: 1, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('1965-03-15').toISOString(), umur: 60, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 4, kelasTertinggi: 12, ijazahTertinggi: 1 },
      { idKeluarga: keluarga[3].id, nomorUrut: 2, namaLengkap: 'Hadi Sutomo', NIK: '3171010101010014', jenisKelamin: 1, hubunganKeluarga: 2, statusKawin: 2, tempatLahir: 'Jakarta', tanggalLahir: new Date('1963-07-22').toISOString(), umur: 62, agama: 1, kartuIdentitas: 1, domisili: 1, partisipasiSekolah: 2, tingkatPendidikan: 4, kelasTertinggi: 12, ijazahTertinggi: 1 },
    ]).returning();
    console.log(`✅ Created ${anggotaKeluarga.length} family members`);

    // 6. Seed Ketenagakerjaan (depends on anggotaKeluarga)
    console.log('💼 Seeding employment data...');
    const ketenagakerjaan = await db.insert(tableKetenagakerjaan).values([
      { idAnggotaKeluarga: anggotaKeluarga[0].id, bekerja: "1", lapanganUsaha: "1", statusPekerjaan: "1", kegiatanUtama: "1", lengkap: "1" }, // Joko
      { idAnggotaKeluarga: anggotaKeluarga[1].id, bekerja: "1", lapanganUsaha: "2", statusPekerjaan: "1", kegiatanUtama: "2", lengkap: "1" }, // Sari Rahayu
      { idAnggotaKeluarga: anggotaKeluarga[2].id, bekerja: "1", lapanganUsaha: "1", statusPekerjaan: "1", kegiatanUtama: "3", lengkap: "1" }, // Budi
      { idAnggotaKeluarga: anggotaKeluarga[4].id, bekerja: "1", lapanganUsaha: "3", statusPekerjaan: "1", kegiatanUtama: "2", lengkap: "1" }, // Maya
      { idAnggotaKeluarga: anggotaKeluarga[5].id, bekerja: "1", lapanganUsaha: "1", statusPekerjaan: "1", kegiatanUtama: "1", lengkap: "1" }, // Dedi
      { idAnggotaKeluarga: anggotaKeluarga[7].id, bekerja: "1", lapanganUsaha: "1", statusPekerjaan: "1", kegiatanUtama: "1", lengkap: "1" }, // Andi
      { idAnggotaKeluarga: anggotaKeluarga[8].id, bekerja: "2", lapanganUsaha: "0", statusPekerjaan: "0", kegiatanUtama: "4", lengkap: "1" }, // Linda (housewife)
      { idAnggotaKeluarga: anggotaKeluarga[12].id, bekerja: "2", lapanganUsaha: "0", statusPekerjaan: "0", kegiatanUtama: "4", lengkap: "1" }, // Sari Dewi (retired)
      { idAnggotaKeluarga: anggotaKeluarga[13].id, bekerja: "2", lapanganUsaha: "0", statusPekerjaan: "0", kegiatanUtama: "4", lengkap: "1" }, // Hadi Sutomo (retired)
    ]).returning();
    console.log(`✅ Created ${ketenagakerjaan.length} employment records`);

    // 7. Seed KeteranganPerumahan (depends on keluarga)
    console.log('🏠 Seeding housing data...');
    const keteranganPerumahan = await db.insert(tableKeteranganPerumahan).values([
      { idKeluarga: keluarga[0].id, luasLantai: 120, statusBangunan: "1", buktiKepemilikan: "1", sumberAirMinum: "1", fasilitasBAB: "1", peneranganUtama: "1", daya: "2200" },
      { idKeluarga: keluarga[1].id, luasLantai: 80, statusBangunan: "1", buktiKepemilikan: "1", sumberAirMinum: "1", fasilitasBAB: "1", peneranganUtama: "1", daya: "1300" },
      { idKeluarga: keluarga[2].id, luasLantai: 150, statusBangunan: "1", buktiKepemilikan: "1", sumberAirMinum: "1", fasilitasBAB: "1", peneranganUtama: "1", daya: "3500" },
      { idKeluarga: keluarga[3].id, luasLantai: 60, statusBangunan: "1", buktiKepemilikan: "2", sumberAirMinum: "2", fasilitasBAB: "1", peneranganUtama: "1", daya: "900" },
    ]).returning();
    console.log(`✅ Created ${keteranganPerumahan.length} housing records`);

    // 8. Seed KeteranganPerumahanBlok2 (depends on keluarga)
    console.log('🌾 Seeding extended housing data...');
    const keteranganPerumahanBlok2 = await db.insert(tableKeteranganPerumahanBlok2).values([
      { idKeluarga: keluarga[0].id, luasPertanianSawah: 0, luasPertanianKebun: 0, luasPertanianKolam: 0, ayam: 5, kambing: 2, sapi: 0 },
      { idKeluarga: keluarga[1].id, luasPertanianSawah: 0, luasPertanianKebun: 0, luasPertanianKolam: 0, ayam: 0, kambing: 0, sapi: 0 },
      { idKeluarga: keluarga[2].id, luasPertanianSawah: 500, luasPertanianKebun: 200, luasPertanianKolam: 100, ayam: 20, kambing: 5, sapi: 2 },
      { idKeluarga: keluarga[3].id, luasPertanianSawah: 0, luasPertanianKebun: 0, luasPertanianKolam: 0, ayam: 0, kambing: 0, sapi: 0 },
    ]).returning();
    console.log(`✅ Created ${keteranganPerumahanBlok2.length} extended housing records`);

    // 9. Seed Bantuan (depends on keluarga and anggotaKeluarga)
    console.log('🎁 Seeding assistance records...');
    const bantuan = await db.insert(tableBantuan).values([
      { idKeluarga: keluarga[0].id, bantuan1tahunTerakhir: 1, bantuanPKH: 1, bantuanBPNT: 1, bantuanBOS: 0, bantuanBAPANAS: 0, bantuanStunting: 0, bantuanKIS: 1, bantuanBLT: 0, bantuanlainnyaNama: 0, bantuanlainnyaStatus: 0, idAnggotaKeluarga: anggotaKeluarga[0].id }, // Joko Susilo
      { idKeluarga: keluarga[1].id, bantuan1tahunTerakhir: 1, bantuanPKH: 0, bantuanBPNT: 1, bantuanBOS: 0, bantuanBAPANAS: 0, bantuanStunting: 0, bantuanKIS: 1, bantuanBLT: 0, bantuanlainnyaNama: 0, bantuanlainnyaStatus: 0, idAnggotaKeluarga: anggotaKeluarga[4].id }, // Maya Sari
      { idKeluarga: keluarga[2].id, bantuan1tahunTerakhir: 1, bantuanPKH: 0, bantuanBPNT: 0, bantuanBOS: 0, bantuanBAPANAS: 0, bantuanStunting: 0, bantuanKIS: 1, bantuanBLT: 0, bantuanlainnyaNama: 0, bantuanlainnyaStatus: 0, idAnggotaKeluarga: anggotaKeluarga[7].id }, // Andi Wijaya
      { idKeluarga: keluarga[3].id, bantuan1tahunTerakhir: 1, bantuanPKH: 0, bantuanBPNT: 0, bantuanBOS: 0, bantuanBAPANAS: 0, bantuanStunting: 0, bantuanKIS: 1, bantuanBLT: 0, bantuanlainnyaNama: 0, bantuanlainnyaStatus: 0, idAnggotaKeluarga: anggotaKeluarga[12].id }, // Sari Dewi
    ]).returning();
    console.log(`✅ Created ${bantuan.length} assistance records`);

    // 10. Seed Disabilitas (depends on keluarga and anggotaKeluarga)
    console.log('♿ Seeding disability records...');
    const disabilitas = await db.insert(tableDisabilitas).values([
      { idKeluarga: keluarga[0].id, disabilisitas: "1", tunaDaksa: "0", tunaWicara: "1", tunaNetra: "0", tunaLaras: "0", tunaLainnyaNama: null, tunaLainnyaStatus: "0", idAnggotaKeluarga: anggotaKeluarga[2].id }, // Budi (speech disability)
      { idKeluarga: keluarga[1].id, disabilisitas: "0", tunaDaksa: "0", tunaWicara: "0", tunaNetra: "0", tunaLaras: "0", tunaLainnyaNama: null, tunaLainnyaStatus: "0", idAnggotaKeluarga: anggotaKeluarga[4].id }, // No disability
      { idKeluarga: keluarga[2].id, disabilisitas: "1", tunaDaksa: "0", tunaWicara: "0", tunaNetra: "0", tunaLaras: "1", tunaLainnyaNama: null, tunaLainnyaStatus: "0", idAnggotaKeluarga: anggotaKeluarga[8].id }, // Linda (hearing disability)
      { idKeluarga: keluarga[2].id, disabilisitas: "1", tunaDaksa: "1", tunaWicara: "0", tunaNetra: "0", tunaLaras: "0", tunaLainnyaNama: null, tunaLainnyaStatus: "0", idAnggotaKeluarga: anggotaKeluarga[10].id }, // Riko (physical disability)
    ]).returning();
    console.log(`✅ Created ${disabilitas.length} disability records`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- MFD Records: ${mfdRecords.length}`);
    console.log(`- Families: ${keluarga.length}`);
    console.log(`- Officer Records: ${ketPetugas.length}`);
    console.log(`- Family Members: ${anggotaKeluarga.length}`);
    console.log(`- Employment Records: ${ketenagakerjaan.length}`);
    console.log(`- Housing Records: ${keteranganPerumahan.length}`);
    console.log(`- Extended Housing Records: ${keteranganPerumahanBlok2.length}`);
    console.log(`- Assistance Records: ${bantuan.length}`);
    console.log(`- Disability Records: ${disabilitas.length}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding finished');
    process.exit(0);
  })
  .catch((e) => {
    console.error('💥 Seeding failed:', e);
    process.exit(1);
  });
