
import { pgTable, serial, text, integer, varchar, date, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  nama: varchar('nama').notNull(),
  email: varchar('email').notNull().unique(),
  username: varchar('username').notNull(),
  password: varchar('password').notNull(),
  photo: varchar('photo').notNull(),
  tanggal_lahir: date('tanggal_lahir').notNull(),
  NoTelpon: varchar('NoTelpon').notNull(),
  role: varchar('role').notNull().default('user'),
  alamat: text('alamat').notNull(),
  isVerified: integer('isVerified').notNull().default(0),
  createdAt: date('created_at').notNull().defaultNow(),
  updatedAt: date('updated_at').notNull().defaultNow(),
  deleted: integer('deleted').notNull().default(0),
});

export type NewUser = typeof usersTable.$inferInsert;

export const tableMFD = pgTable('mfd', {
  id: serial('id').primaryKey(),
  namaProvinsi: varchar('r101Pro').notNull(),
  kodeProvinsi: varchar('r101KPro').notNull(),
  namaKabupaten: varchar('r102Kab').notNull(),
  kodeKabupaten: varchar('r102KKab').notNull(),
  namaKecamatan: varchar('r103Kec').notNull(),
  kodeKecamatan: varchar('r103KKec').notNull(),
  namaDesa: varchar('r104Des').notNull(),
  kodeDesa: varchar('r104KDes').notNull(),
  namaDusun: varchar('r105Dus').notNull(),
  kodeDusun: varchar('r105KDus').notNull(),
  namaSLS: varchar('r106SLS').notNull(),
  kodeSLS: varchar('r106KSLS').notNull(),
  namaSubSLS: varchar('r107SSLS').notNull(),
  kodeSubSLS: varchar('r107KSSLS').notNull(),
});

export type NewMFD = typeof tableMFD.$inferInsert;

export const tableKeluarga = pgTable('keluarga', {
  id: serial('id').primaryKey(),
  namaKepalaKeluarga: varchar('r108NKK').notNull(),
  anggotaKeluarga: integer('r109AK').notNull(),
  nomorKartuKeluarga: varchar('r110NKK').notNull(),
  alamat: text('r111AL').notNull(),
  idMFD: integer('mfdId').notNull().references(() => tableMFD.id),
  catatan: text('rNote').notNull(),
});

export type NewKeluarga = typeof tableKeluarga.$inferInsert;

export const tableKetPetugas = pgTable('ketPetugas', {
  id: serial('id').primaryKey(),
  tanggalPendataan: date('r201TP').notNull(),
  namaPendata: varchar('r202NP').notNull(),
  kodePendata: integer('r202KP').notNull().references(() => usersTable.id), //reference to user table
  tanggalPemeriksaan: date('r203TPr').notNull(),
  namaPemeriksa: varchar('r204NPr').notNull(),
  kodePemeriksa: integer('r204KPr').notNull().references(() => usersTable.id), //reference to user table
  hasilPendataan: varchar('r205HP').notNull(),
  idKeluarga: integer('keluargaId').notNull().references(() => tableKeluarga.id),
});

export type NewKetPetugas = typeof tableKetPetugas.$inferInsert;

export const tableAnggotaKeluarga = pgTable('anggotaKeluarga', {
  id: serial('id').primaryKey(),
  idKeluarga: integer('keluargaId').notNull().references(() => tableKeluarga.id),
  nomorUrut: integer('r301NU').notNull(),
  namaLengkap: varchar('r302NL').notNull(),
  NIK: varchar('r303NIK').notNull(),
  jenisKelamin: integer('r304JK').notNull(),
  hubunganKeluarga: integer('r305HK').notNull(),
  statusKawin: integer('r306SK').notNull(),
  tempatLahir: varchar('r307TL').notNull(),
  tanggalLahir: date('r308TGL').notNull(),
  umur: integer('r309UM').notNull(),
  agama: integer('r310AG').notNull(),
  kartuIdentitas: integer('r311KI').notNull(),
  domisili: integer('r312DOM').notNull(),
  partisipasiSekolah: integer('r313PS').notNull(),
  tingkatPendidikan: integer('r314TP').notNull(),
  kelasTertinggi: integer('r315KT').notNull(),
  ijazahTertinggi: integer('r316IT').notNull(),
});

export type NewAnggotaKeluarga = typeof tableAnggotaKeluarga.$inferInsert;

export const tableKetenagakerjaan = pgTable('ketenagakerjaan', {
  id: serial('id').primaryKey(),
  idAnggotaKeluarga: integer('anggotaKeluargaId').notNull().references(() => tableAnggotaKeluarga.id),
  bekerja: varchar('r317B'),
  lapanganUsaha: varchar('r318LU'),
  statusPekerjaan: varchar('r319SP'),
  kegiatanUtama: varchar('r320KU'),
  lengkap: varchar('r321L'),
});

export type NewKetenagakerjaan = typeof tableKetenagakerjaan.$inferInsert;

export const tableKeteranganPerumahan = pgTable('ketPerumahan', {
  id: serial('id').primaryKey(),
  idKeluarga: integer('keluargaId').notNull().references(() => tableKeluarga.id),
  luasLantai: doublePrecision('r401LL'),
  statusBangunan: varchar('r402Sk'),
  buktiKepemilikan: varchar('r403BK'),
  sumberAirMinum: varchar('r404SAM'),
  fasilitasBAB: varchar('r405FB'),
  peneranganUtama: varchar('r406PU'),
  daya: varchar('r407D'),
});

export type NewKeteranganPerumahan = typeof tableKeteranganPerumahan.$inferInsert;

export const tableKeteranganPerumahanBlok2 = pgTable('ketPerumahanBlok2', {
  id: serial('id').primaryKey(),
  idKeluarga: integer('keluargaId').notNull().references(() => tableKeluarga.id),
  luasPertanianSawah: doublePrecision('r408LPS'),
  luasPertanianKebun: doublePrecision('r409LPK'),
  luasPertanianKolam: doublePrecision('r410LPKo'),
  ayam: integer('r411A'),
  kambing: integer('r412K'),
  sapi: integer('r413S'),
});

export type NewKeteranganPerumahanBlok2 = typeof tableKeteranganPerumahanBlok2.$inferInsert;

export const tableBantuan = pgTable('bantuan', {
  id: serial('id').primaryKey(),
  idKeluarga: integer('keluargaId').notNull().references(() => tableKeluarga.id),

  bantuan1tahunTerakhir: integer('r501B1T'),
  //502 kode 1-8
  bantuanPKH: integer('r502BPKH'),
  bantuanBPNT: integer('r502BBPNT'),
  bantuanBOS: integer('r502BOS'),
  bantuanBAPANAS: integer('r502BAPANAS'),
  bantuanStunting: integer('r502BSTUNTING'),
  bantuanKIS: integer('r502BKIS'),
  bantuanBLT: integer('r502BBLT'),
  bantuanlainnyaStatus: integer('r502BLS'),
  bantuanlainnyaNama: integer('r502BLN'),
  idAnggotaKeluarga: integer('r503id').notNull().references(() => tableAnggotaKeluarga.id),
}); // many anggota keluarga can have one bantuan, need to check

export type NewBantuan = typeof tableBantuan.$inferInsert;

export const tableDisabilitas = pgTable('disabilitas', {
  id: serial('id').primaryKey(),
  idKeluarga: integer('keluargaId').notNull().references(() => tableKeluarga.id),
  disabilisitas: varchar('r601D'), //yes or no
  // type 602 sub 1-6
  tunaDaksa: varchar('r602TD'),
  tunaWicara: varchar('r602TW'),
  tunaNetra: varchar('r602TN'),
  tunaLaras: varchar('r602TL'),
  tunaLainnyaStatus: varchar('r602NS'),
  tunaLainnyaNama: varchar('r602TLNama'),
  idAnggotaKeluarga: integer('r602id').notNull().references(() => tableAnggotaKeluarga.id),
}); // many anggota keluarga can have one disabilitas, need to check

export type NewDisabilitas = typeof tableDisabilitas.$inferInsert;

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  ketPetugasPendata: many(tableKetPetugas, { relationName: "pendata" }),
  ketPetugasPemeriksa: many(tableKetPetugas, { relationName: "pemeriksa" }),
}));

export const mfdRelations = relations(tableMFD, ({ many }) => ({
  keluarga: many(tableKeluarga),
}));

export const keluargaRelations = relations(tableKeluarga, ({ one, many }) => ({
  mfd: one(tableMFD, { fields: [tableKeluarga.idMFD], references: [tableMFD.id] }),
  ketPetugas: many(tableKetPetugas),
  anggotaKeluarga: many(tableAnggotaKeluarga),
  keteranganPerumahan: many(tableKeteranganPerumahan),
  keteranganPerumahanBlok2: many(tableKeteranganPerumahanBlok2),
  bantuan: many(tableBantuan),
  disabilitas: many(tableDisabilitas),
}));

export const tableKetPetugasRelations = relations(tableKetPetugas, ({ one }) => ({
  pendata: one(usersTable, { fields: [tableKetPetugas.kodePendata], references: [usersTable.id], relationName: "pendata" }),
  pemeriksa: one(usersTable, { fields: [tableKetPetugas.kodePemeriksa], references: [usersTable.id], relationName: "pemeriksa" }),
  keluarga: one(tableKeluarga, { fields: [tableKetPetugas.idKeluarga], references: [tableKeluarga.id] }),
}));

export const anggotaKeluargaRelations = relations(tableAnggotaKeluarga, ({ one, many }) => ({
  keluarga: one(tableKeluarga, { fields: [tableAnggotaKeluarga.idKeluarga], references: [tableKeluarga.id] }),
  ketenagakerjaan: many(tableKetenagakerjaan),
  bantuan: many(tableBantuan),
  disabilitas: many(tableDisabilitas),
}));

export const ketenagakerjaanRelations = relations(tableKetenagakerjaan, ({ one }) => ({
  anggotaKeluarga: one(tableAnggotaKeluarga, { fields: [tableKetenagakerjaan.idAnggotaKeluarga], references: [tableAnggotaKeluarga.id] }),
}));

export const keteranganPerumahanRelations = relations(tableKeteranganPerumahan, ({ one }) => ({
  keluarga: one(tableKeluarga, { fields: [tableKeteranganPerumahan.idKeluarga], references: [tableKeluarga.id] }),
}));

export const keteranganPerumahanBlok2Relations = relations(tableKeteranganPerumahanBlok2, ({ one }) => ({
  keluarga: one(tableKeluarga, { fields: [tableKeteranganPerumahanBlok2.idKeluarga], references: [tableKeluarga.id] }),
}));

export const bantuanRelations = relations(tableBantuan, ({ one }) => ({
  keluarga: one(tableKeluarga, { fields: [tableBantuan.idKeluarga], references: [tableKeluarga.id] }),
  anggotaKeluarga: one(tableAnggotaKeluarga, { fields: [tableBantuan.idAnggotaKeluarga], references: [tableAnggotaKeluarga.id] }),
}));

export const disabilitasRelations = relations(tableDisabilitas, ({ one }) => ({
  keluarga: one(tableKeluarga, { fields: [tableDisabilitas.idKeluarga], references: [tableKeluarga.id] }),
  anggotaKeluarga: one(tableAnggotaKeluarga, { fields: [tableDisabilitas.idAnggotaKeluarga], references: [tableAnggotaKeluarga.id] }),
}));
