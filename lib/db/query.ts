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
    tableDisabilitas,
    type NewUser,
    type NewMFD,
    type NewKeluarga,
    type NewKetPetugas,
    type NewAnggotaKeluarga,
    type NewKetenagakerjaan,
    type NewKeteranganPerumahan,
    type NewKeteranganPerumahanBlok2,
    type NewBantuan,
    type NewDisabilitas,
} from './schema';
import { eq, and, ne } from 'drizzle-orm';

// ==================== USERS QUERIES ====================

export async function getUserById(id: number) {
    const users = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return users[0] || null;
}

export async function getUserByEmail(email: string) {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return users[0] || null;
}

export async function getUserByUsername(username: string) {
    const users = await db.select().from(usersTable).where(eq(usersTable.username, username));
    return users[0] || null;
}

export async function getAllUsers() {
    return await db.select().from(usersTable).where(eq(usersTable.deleted, 0));
}

export async function createUser(data: NewUser) {
    const result = await db.insert(usersTable).values(data).returning();
    return result[0];
}

export async function updateUser(id: number, data: Partial<NewUser>) {
    const result = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning();
    return result[0] || null;
}

export async function deleteUser(id: number) {
    const result = await db.update(usersTable).set({ deleted: 1 }).where(eq(usersTable.id, id)).returning();
    return result[0] || null;
}

export async function hardDeleteUser(id: number) {
    const result = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    return result[0] || null;
}

// ==================== MFD QUERIES ====================

export async function getMFDById(id: number) {
    const mfds = await db.select().from(tableMFD).where(eq(tableMFD.id, id));
    return mfds[0] || null;
}

export async function getMFDByKode(kodeDesa: string, kodeDusun: string, kodeSLS: string, kodeSubSLS: string) {
    const mfds = await db.select().from(tableMFD).where(
        and(
            eq(tableMFD.kodeDesa, kodeDesa),
            eq(tableMFD.kodeDusun, kodeDusun),
            eq(tableMFD.kodeSLS, kodeSLS),
            eq(tableMFD.kodeSubSLS, kodeSubSLS)
        )
    );
    return mfds[0] || null;
}

export async function getAllMFD() {
    return await db.select().from(tableMFD);
}

export async function getMFDByProvinsi(kodeProvinsi: string) {
    return await db.select().from(tableMFD).where(eq(tableMFD.kodeProvinsi, kodeProvinsi));
}

export async function getMFDByKabupaten(kodeKabupaten: string) {
    return await db.select().from(tableMFD).where(eq(tableMFD.kodeKabupaten, kodeKabupaten));
}

export async function createMFD(data: NewMFD) {
    const result = await db.insert(tableMFD).values(data).returning();
    return result[0];
}

export async function updateMFD(id: number, data: Partial<NewMFD>) {
    const result = await db.update(tableMFD).set(data).where(eq(tableMFD.id, id)).returning();
    return result[0] || null;
}

export async function deleteMFD(id: number) {
    const result = await db.delete(tableMFD).where(eq(tableMFD.id, id)).returning();
    return result[0] || null;
}

// ==================== KELUARGA QUERIES ====================

export async function getKeluargaById(id: number) {
    const keluargas = await db.select().from(tableKeluarga).where(eq(tableKeluarga.id, id));
    return keluargas[0] || null;
}

export async function getKeluargaByIdWithMFD(id: number) {
    const result = await db
        .select({
            id: tableKeluarga.id,
            namaKepalaKeluarga: tableKeluarga.namaKepalaKeluarga,
            anggotaKeluarga: tableKeluarga.anggotaKeluarga,
            nomorKartuKeluarga: tableKeluarga.nomorKartuKeluarga,
            alamat: tableKeluarga.alamat,
            idMFD: tableKeluarga.idMFD,
            catatan: tableKeluarga.catatan,
            mfd: {
                id: tableMFD.id,
                namaProvinsi: tableMFD.namaProvinsi,
                kodeProvinsi: tableMFD.kodeProvinsi,
                namaKabupaten: tableMFD.namaKabupaten,
                kodeKabupaten: tableMFD.kodeKabupaten,
                namaKecamatan: tableMFD.namaKecamatan,
                kodeKecamatan: tableMFD.kodeKecamatan,
                namaDesa: tableMFD.namaDesa,
                kodeDesa: tableMFD.kodeDesa,
                namaDusun: tableMFD.namaDusun,
                kodeDusun: tableMFD.kodeDusun,
                namaSLS: tableMFD.namaSLS,
                kodeSLS: tableMFD.kodeSLS,
                namaSubSLS: tableMFD.namaSubSLS,
                kodeSubSLS: tableMFD.kodeSubSLS,
            }
        })
        .from(tableKeluarga)
        .leftJoin(tableMFD, eq(tableKeluarga.idMFD, tableMFD.id))
        .where(eq(tableKeluarga.id, id));
    return result[0] || null;
}

export async function getKeluargaByNomorKK(nomorKartuKeluarga: string) {
    const keluargas = await db.select().from(tableKeluarga).where(eq(tableKeluarga.nomorKartuKeluarga, nomorKartuKeluarga));
    return keluargas[0] || null;
}

export async function getKeluargaByNomorKKExcludingId(nomorKartuKeluarga: string, excludeId: number) {
    const keluargas = await db
        .select()
        .from(tableKeluarga)
        .where(
            and(
                eq(tableKeluarga.nomorKartuKeluarga, nomorKartuKeluarga),
                ne(tableKeluarga.id, excludeId)
            )
        );
    return keluargas[0] || null;
}

export async function getAllKeluarga() {
    return await db.select().from(tableKeluarga);
}

export async function getAllKeluargaWithMFD() {
    return await db
        .select({
            id: tableKeluarga.id,
            namaKepalaKeluarga: tableKeluarga.namaKepalaKeluarga,
            anggotaKeluarga: tableKeluarga.anggotaKeluarga,
            nomorKartuKeluarga: tableKeluarga.nomorKartuKeluarga,
            alamat: tableKeluarga.alamat,
            idMFD: tableKeluarga.idMFD,
            catatan: tableKeluarga.catatan,
            mfd: {
                id: tableMFD.id,
                namaProvinsi: tableMFD.namaProvinsi,
                kodeProvinsi: tableMFD.kodeProvinsi,
                namaKabupaten: tableMFD.namaKabupaten,
                kodeKabupaten: tableMFD.kodeKabupaten,
                namaKecamatan: tableMFD.namaKecamatan,
                kodeKecamatan: tableMFD.kodeKecamatan,
                namaDesa: tableMFD.namaDesa,
                kodeDesa: tableMFD.kodeDesa,
                namaDusun: tableMFD.namaDusun,
                kodeDusun: tableMFD.kodeDusun,
                namaSLS: tableMFD.namaSLS,
                kodeSLS: tableMFD.kodeSLS,
                namaSubSLS: tableMFD.namaSubSLS,
                kodeSubSLS: tableMFD.kodeSubSLS,
            }
        })
        .from(tableKeluarga)
        .leftJoin(tableMFD, eq(tableKeluarga.idMFD, tableMFD.id));
}

export async function getKeluargaByMFD(idMFD: number) {
    return await db.select().from(tableKeluarga).where(eq(tableKeluarga.idMFD, idMFD));
}

export async function createKeluarga(data: NewKeluarga) {
    const result = await db.insert(tableKeluarga).values(data).returning();
    return result[0];
}

export async function updateKeluarga(id: number, data: Partial<NewKeluarga>) {
    const result = await db.update(tableKeluarga).set(data).where(eq(tableKeluarga.id, id)).returning();
    return result[0] || null;
}

export async function deleteKeluarga(id: number) {
    const result = await db.delete(tableKeluarga).where(eq(tableKeluarga.id, id)).returning();
    return result[0] || null;
}

export async function hasKeluargaRelatedRecords(id: number) {
    const [anggota, ketPetugas, ketPerumahan, ketPerumahanBlok2, bantuan, disabilitas] = await Promise.all([
        db.select().from(tableAnggotaKeluarga).where(eq(tableAnggotaKeluarga.idKeluarga, id)),
        db.select().from(tableKetPetugas).where(eq(tableKetPetugas.idKeluarga, id)),
        db.select().from(tableKeteranganPerumahan).where(eq(tableKeteranganPerumahan.idKeluarga, id)),
        db.select().from(tableKeteranganPerumahanBlok2).where(eq(tableKeteranganPerumahanBlok2.idKeluarga, id)),
        db.select().from(tableBantuan).where(eq(tableBantuan.idKeluarga, id)),
        db.select().from(tableDisabilitas).where(eq(tableDisabilitas.idKeluarga, id)),
    ]);
    
    return anggota.length > 0 || ketPetugas.length > 0 || ketPerumahan.length > 0 || 
           ketPerumahanBlok2.length > 0 || bantuan.length > 0 || disabilitas.length > 0;
}

// ==================== KETERANGAN PETUGAS QUERIES ====================

export async function getKetPetugasById(id: number) {
    const ketPetugas = await db.select().from(tableKetPetugas).where(eq(tableKetPetugas.id, id));
    return ketPetugas[0] || null;
}

export async function getKetPetugasByKeluarga(idKeluarga: number) {
    return await db.select().from(tableKetPetugas).where(eq(tableKetPetugas.idKeluarga, idKeluarga));
}

export async function getKetPetugasByPendata(kodePendata: number) {
    return await db.select().from(tableKetPetugas).where(eq(tableKetPetugas.kodePendata, kodePendata));
}

export async function getKetPetugasByPemeriksa(kodePemeriksa: number) {
    return await db.select().from(tableKetPetugas).where(eq(tableKetPetugas.kodePemeriksa, kodePemeriksa));
}

export async function getAllKetPetugas() {
    return await db.select().from(tableKetPetugas);
}

export async function createKetPetugas(data: NewKetPetugas) {
    const result = await db.insert(tableKetPetugas).values(data).returning();
    return result[0];
}

export async function updateKetPetugas(id: number, data: Partial<NewKetPetugas>) {
    const result = await db.update(tableKetPetugas).set(data).where(eq(tableKetPetugas.id, id)).returning();
    return result[0] || null;
}

export async function deleteKetPetugas(id: number) {
    const result = await db.delete(tableKetPetugas).where(eq(tableKetPetugas.id, id)).returning();
    return result[0] || null;
}

// ==================== ANGGOTA KELUARGA QUERIES ====================

export async function getAnggotaKeluargaById(id: number) {
    const anggota = await db.select().from(tableAnggotaKeluarga).where(eq(tableAnggotaKeluarga.id, id));
    return anggota[0] || null;
}

export async function getAnggotaKeluargaByNIK(NIK: string) {
    const anggota = await db.select().from(tableAnggotaKeluarga).where(eq(tableAnggotaKeluarga.NIK, NIK));
    return anggota[0] || null;
}

export async function getAnggotaKeluargaByNIKExcludingId(NIK: string, excludeId: number) {
    const anggota = await db
        .select()
        .from(tableAnggotaKeluarga)
        .where(
            and(
                eq(tableAnggotaKeluarga.NIK, NIK),
                ne(tableAnggotaKeluarga.id, excludeId)
            )
        );
    return anggota[0] || null;
}

export async function getAnggotaKeluargaByKeluarga(idKeluarga: number) {
    return await db.select().from(tableAnggotaKeluarga).where(eq(tableAnggotaKeluarga.idKeluarga, idKeluarga));
}

export async function getAllAnggotaKeluarga() {
    return await db.select().from(tableAnggotaKeluarga);
}

export async function createAnggotaKeluarga(data: NewAnggotaKeluarga) {
    const result = await db.insert(tableAnggotaKeluarga).values(data).returning();
    return result[0];
}

export async function updateAnggotaKeluarga(id: number, data: Partial<NewAnggotaKeluarga>) {
    const result = await db.update(tableAnggotaKeluarga).set(data).where(eq(tableAnggotaKeluarga.id, id)).returning();
    return result[0] || null;
}

export async function deleteAnggotaKeluarga(id: number) {
    const result = await db.delete(tableAnggotaKeluarga).where(eq(tableAnggotaKeluarga.id, id)).returning();
    return result[0] || null;
}

export async function hasAnggotaKeluargaRelatedRecords(id: number) {
    const [ketenagakerjaan, bantuan, disabilitas] = await Promise.all([
        db.select().from(tableKetenagakerjaan).where(eq(tableKetenagakerjaan.idAnggotaKeluarga, id)),
        db.select().from(tableBantuan).where(eq(tableBantuan.idAnggotaKeluarga, id)),
        db.select().from(tableDisabilitas).where(eq(tableDisabilitas.idAnggotaKeluarga, id)),
    ]);
    
    return ketenagakerjaan.length > 0 || bantuan.length > 0 || disabilitas.length > 0;
}

// ==================== KETENAGAKERJAAN QUERIES ====================

export async function getKetenagakerjaanById(id: number) {
    const ketenagakerjaan = await db.select().from(tableKetenagakerjaan).where(eq(tableKetenagakerjaan.id, id));
    return ketenagakerjaan[0] || null;
}

export async function getKetenagakerjaanByAnggota(idAnggotaKeluarga: number) {
    return await db.select().from(tableKetenagakerjaan).where(eq(tableKetenagakerjaan.idAnggotaKeluarga, idAnggotaKeluarga));
}

export async function getAllKetenagakerjaan() {
    return await db.select().from(tableKetenagakerjaan);
}

export async function createKetenagakerjaan(data: NewKetenagakerjaan) {
    const result = await db.insert(tableKetenagakerjaan).values(data).returning();
    return result[0];
}

export async function updateKetenagakerjaan(id: number, data: Partial<NewKetenagakerjaan>) {
    const result = await db.update(tableKetenagakerjaan).set(data).where(eq(tableKetenagakerjaan.id, id)).returning();
    return result[0] || null;
}

export async function deleteKetenagakerjaan(id: number) {
    const result = await db.delete(tableKetenagakerjaan).where(eq(tableKetenagakerjaan.id, id)).returning();
    return result[0] || null;
}

// ==================== KETERANGAN PERUMAHAN QUERIES ====================

export async function getKeteranganPerumahanById(id: number) {
    const ketPerumahan = await db.select().from(tableKeteranganPerumahan).where(eq(tableKeteranganPerumahan.id, id));
    return ketPerumahan[0] || null;
}

export async function getKeteranganPerumahanByKeluarga(idKeluarga: number) {
    return await db.select().from(tableKeteranganPerumahan).where(eq(tableKeteranganPerumahan.idKeluarga, idKeluarga));
}

export async function getAllKeteranganPerumahan() {
    return await db.select().from(tableKeteranganPerumahan);
}

export async function createKeteranganPerumahan(data: NewKeteranganPerumahan) {
    const result = await db.insert(tableKeteranganPerumahan).values(data).returning();
    return result[0];
}

export async function updateKeteranganPerumahan(id: number, data: Partial<NewKeteranganPerumahan>) {
    const result = await db.update(tableKeteranganPerumahan).set(data).where(eq(tableKeteranganPerumahan.id, id)).returning();
    return result[0] || null;
}

export async function deleteKeteranganPerumahan(id: number) {
    const result = await db.delete(tableKeteranganPerumahan).where(eq(tableKeteranganPerumahan.id, id)).returning();
    return result[0] || null;
}

// ==================== KETERANGAN PERUMAHAN BLOK 2 QUERIES ====================

export async function getKeteranganPerumahanBlok2ById(id: number) {
    const ketPerumahanBlok2 = await db.select().from(tableKeteranganPerumahanBlok2).where(eq(tableKeteranganPerumahanBlok2.id, id));
    return ketPerumahanBlok2[0] || null;
}

export async function getKeteranganPerumahanBlok2ByKeluarga(idKeluarga: number) {
    return await db.select().from(tableKeteranganPerumahanBlok2).where(eq(tableKeteranganPerumahanBlok2.idKeluarga, idKeluarga));
}

export async function getAllKeteranganPerumahanBlok2() {
    return await db.select().from(tableKeteranganPerumahanBlok2);
}

export async function createKeteranganPerumahanBlok2(data: NewKeteranganPerumahanBlok2) {
    const result = await db.insert(tableKeteranganPerumahanBlok2).values(data).returning();
    return result[0];
}

export async function updateKeteranganPerumahanBlok2(id: number, data: Partial<NewKeteranganPerumahanBlok2>) {
    const result = await db.update(tableKeteranganPerumahanBlok2).set(data).where(eq(tableKeteranganPerumahanBlok2.id, id)).returning();
    return result[0] || null;
}

export async function deleteKeteranganPerumahanBlok2(id: number) {
    const result = await db.delete(tableKeteranganPerumahanBlok2).where(eq(tableKeteranganPerumahanBlok2.id, id)).returning();
    return result[0] || null;
}

// ==================== BANTUAN QUERIES ====================

export async function getBantuanById(id: number) {
    const bantuan = await db.select().from(tableBantuan).where(eq(tableBantuan.id, id));
    return bantuan[0] || null;
}

export async function getBantuanByKeluarga(idKeluarga: number) {
    return await db.select().from(tableBantuan).where(eq(tableBantuan.idKeluarga, idKeluarga));
}

export async function getBantuanByAnggota(idAnggotaKeluarga: number) {
    return await db.select().from(tableBantuan).where(eq(tableBantuan.idAnggotaKeluarga, idAnggotaKeluarga));
}

export async function getAllBantuan() {
    return await db.select().from(tableBantuan);
}

export async function createBantuan(data: NewBantuan) {
    const result = await db.insert(tableBantuan).values(data).returning();
    return result[0];
}

export async function updateBantuan(id: number, data: Partial<NewBantuan>) {
    const result = await db.update(tableBantuan).set(data).where(eq(tableBantuan.id, id)).returning();
    return result[0] || null;
}

export async function deleteBantuan(id: number) {
    const result = await db.delete(tableBantuan).where(eq(tableBantuan.id, id)).returning();
    return result[0] || null;
}

// ==================== DISABILITAS QUERIES ====================

export async function getDisabilitasById(id: number) {
    const disabilitas = await db.select().from(tableDisabilitas).where(eq(tableDisabilitas.id, id));
    return disabilitas[0] || null;
}

export async function getDisabilitasByKeluarga(idKeluarga: number) {
    return await db.select().from(tableDisabilitas).where(eq(tableDisabilitas.idKeluarga, idKeluarga));
}

export async function getDisabilitasByAnggota(idAnggotaKeluarga: number) {
    return await db.select().from(tableDisabilitas).where(eq(tableDisabilitas.idAnggotaKeluarga, idAnggotaKeluarga));
}

export async function getAllDisabilitas() {
    return await db.select().from(tableDisabilitas);
}

export async function createDisabilitas(data: NewDisabilitas) {
    const result = await db.insert(tableDisabilitas).values(data).returning();
    return result[0];
}

export async function updateDisabilitas(id: number, data: Partial<NewDisabilitas>) {
    const result = await db.update(tableDisabilitas).set(data).where(eq(tableDisabilitas.id, id)).returning();
    return result[0] || null;
}

export async function deleteDisabilitas(id: number) {
    const result = await db.delete(tableDisabilitas).where(eq(tableDisabilitas.id, id)).returning();
    return result[0] || null;
}
