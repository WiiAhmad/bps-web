import { pgTable, foreignKey, check, serial, varchar, integer, text, date, unique, boolean, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const keluarga = pgTable("keluarga", {
	id: serial().primaryKey().notNull(),
	r108Nkk: varchar().notNull(),
	r109Ak: integer().notNull(),
	r110Nkk: varchar().notNull(),
	r111Al: text().notNull(),
	mfdId: integer().notNull(),
	rNote: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.mfdId],
			foreignColumns: [mfd.id],
			name: "keluarga_mfdId_mfd_id_fk"
		}),
	check("keluarga_id_not_null", sql`NOT NULL id`),
	check("keluarga_r108NKK_not_null", sql`NOT NULL "r108NKK"`),
	check("keluarga_r109AK_not_null", sql`NOT NULL "r109AK"`),
	check("keluarga_r110NKK_not_null", sql`NOT NULL "r110NKK"`),
	check("keluarga_r111AL_not_null", sql`NOT NULL "r111AL"`),
	check("keluarga_mfdId_not_null", sql`NOT NULL "mfdId"`),
	check("keluarga_rNote_not_null", sql`NOT NULL "rNote"`),
]);

export const anggotaKeluarga = pgTable("anggotaKeluarga", {
	id: serial().primaryKey().notNull(),
	keluargaId: integer().notNull(),
	r301Nu: integer().notNull(),
	r302Nl: varchar().notNull(),
	r303Nik: varchar().notNull(),
	r304Jk: integer().notNull(),
	r305Hk: integer().notNull(),
	r306Sk: integer().notNull(),
	r307Tl: varchar().notNull(),
	r308Tgl: date().notNull(),
	r309Um: integer().notNull(),
	r310Ag: integer().notNull(),
	r311Ki: integer().notNull(),
	r312Dom: integer().notNull(),
	r313Ps: integer().notNull(),
	r314Tp: integer().notNull(),
	r315Kt: integer().notNull(),
	r316It: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.keluargaId],
			foreignColumns: [keluarga.id],
			name: "anggotaKeluarga_keluargaId_keluarga_id_fk"
		}),
	check("anggotaKeluarga_id_not_null", sql`NOT NULL id`),
	check("anggotaKeluarga_keluargaId_not_null", sql`NOT NULL "keluargaId"`),
	check("anggotaKeluarga_r301NU_not_null", sql`NOT NULL "r301NU"`),
	check("anggotaKeluarga_r302NL_not_null", sql`NOT NULL "r302NL"`),
	check("anggotaKeluarga_r303NIK_not_null", sql`NOT NULL "r303NIK"`),
	check("anggotaKeluarga_r304JK_not_null", sql`NOT NULL "r304JK"`),
	check("anggotaKeluarga_r305HK_not_null", sql`NOT NULL "r305HK"`),
	check("anggotaKeluarga_r306SK_not_null", sql`NOT NULL "r306SK"`),
	check("anggotaKeluarga_r307TL_not_null", sql`NOT NULL "r307TL"`),
	check("anggotaKeluarga_r308TGL_not_null", sql`NOT NULL "r308TGL"`),
	check("anggotaKeluarga_r309UM_not_null", sql`NOT NULL "r309UM"`),
	check("anggotaKeluarga_r310AG_not_null", sql`NOT NULL "r310AG"`),
	check("anggotaKeluarga_r311KI_not_null", sql`NOT NULL "r311KI"`),
	check("anggotaKeluarga_r312DOM_not_null", sql`NOT NULL "r312DOM"`),
	check("anggotaKeluarga_r313PS_not_null", sql`NOT NULL "r313PS"`),
	check("anggotaKeluarga_r314TP_not_null", sql`NOT NULL "r314TP"`),
	check("anggotaKeluarga_r315KT_not_null", sql`NOT NULL "r315KT"`),
	check("anggotaKeluarga_r316IT_not_null", sql`NOT NULL "r316IT"`),
]);

export const bantuan = pgTable("bantuan", {
	id: serial().primaryKey().notNull(),
	keluargaId: integer().notNull(),
	r501B1T: integer(),
	r502Bpkh: integer(),
	r502Bbpnt: integer(),
	r502Bos: integer(),
	r502Bapanas: integer(),
	r502Bstunting: integer(),
	r502Bkis: integer(),
	r502Bblt: integer(),
	r502Bls: integer(),
	r502Bln: integer(),
	r503Id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.keluargaId],
			foreignColumns: [keluarga.id],
			name: "bantuan_keluargaId_keluarga_id_fk"
		}),
	foreignKey({
			columns: [table.r503Id],
			foreignColumns: [anggotaKeluarga.id],
			name: "bantuan_r503id_anggotaKeluarga_id_fk"
		}),
	check("bantuan_id_not_null", sql`NOT NULL id`),
	check("bantuan_keluargaId_not_null", sql`NOT NULL "keluargaId"`),
	check("bantuan_r503id_not_null", sql`NOT NULL r503id`),
]);

export const mfd = pgTable("mfd", {
	id: serial().primaryKey().notNull(),
	r101Pro: varchar().notNull(),
	r101KPro: varchar().notNull(),
	r102Kab: varchar().notNull(),
	r102KKab: varchar().notNull(),
	r103Kec: varchar().notNull(),
	r103KKec: varchar().notNull(),
	r104Des: varchar().notNull(),
	r104KDes: varchar().notNull(),
	r105Dus: varchar().notNull(),
	r105KDus: varchar().notNull(),
	r106Sls: varchar().notNull(),
	r106Ksls: varchar().notNull(),
	r107Ssls: varchar().notNull(),
	r107Kssls: varchar().notNull(),
}, (table) => [
	check("mfd_id_not_null", sql`NOT NULL id`),
	check("mfd_r101Pro_not_null", sql`NOT NULL "r101Pro"`),
	check("mfd_r101KPro_not_null", sql`NOT NULL "r101KPro"`),
	check("mfd_r102Kab_not_null", sql`NOT NULL "r102Kab"`),
	check("mfd_r102KKab_not_null", sql`NOT NULL "r102KKab"`),
	check("mfd_r103Kec_not_null", sql`NOT NULL "r103Kec"`),
	check("mfd_r103KKec_not_null", sql`NOT NULL "r103KKec"`),
	check("mfd_r104Des_not_null", sql`NOT NULL "r104Des"`),
	check("mfd_r104KDes_not_null", sql`NOT NULL "r104KDes"`),
	check("mfd_r105Dus_not_null", sql`NOT NULL "r105Dus"`),
	check("mfd_r105KDus_not_null", sql`NOT NULL "r105KDus"`),
	check("mfd_r106SLS_not_null", sql`NOT NULL "r106SLS"`),
	check("mfd_r106KSLS_not_null", sql`NOT NULL "r106KSLS"`),
	check("mfd_r107SSLS_not_null", sql`NOT NULL "r107SSLS"`),
	check("mfd_r107KSSLS_not_null", sql`NOT NULL "r107KSSLS"`),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	nama: varchar().notNull(),
	email: varchar().notNull(),
	username: varchar().notNull(),
	password: varchar().notNull(),
	photo: varchar().notNull(),
	tanggalLahir: date("tanggal_lahir").notNull(),
	noTelpon: varchar("NoTelpon").notNull(),
	role: varchar().default('user').notNull(),
	alamat: text().notNull(),
	createdAt: date("created_at").defaultNow().notNull(),
	updatedAt: date("updated_at").defaultNow().notNull(),
	deleted: integer().default(0).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
	check("users_id_not_null", sql`NOT NULL id`),
	check("users_nama_not_null", sql`NOT NULL nama`),
	check("users_email_not_null", sql`NOT NULL email`),
	check("users_username_not_null", sql`NOT NULL username`),
	check("users_password_not_null", sql`NOT NULL password`),
	check("users_photo_not_null", sql`NOT NULL photo`),
	check("users_tanggal_lahir_not_null", sql`NOT NULL tanggal_lahir`),
	check("users_NoTelpon_not_null", sql`NOT NULL "NoTelpon"`),
	check("users_role_not_null", sql`NOT NULL role`),
	check("users_alamat_not_null", sql`NOT NULL alamat`),
	check("users_created_at_not_null", sql`NOT NULL created_at`),
	check("users_updated_at_not_null", sql`NOT NULL updated_at`),
	check("users_deleted_not_null", sql`NOT NULL deleted`),
]);

export const ketPetugas = pgTable("ketPetugas", {
	id: serial().primaryKey().notNull(),
	r201Tp: date().notNull(),
	r202Np: varchar().notNull(),
	r202Kp: integer().notNull(),
	r203TPr: date().notNull(),
	r204NPr: varchar().notNull(),
	r204KPr: integer().notNull(),
	r205Hp: varchar().notNull(),
	keluargaId: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.r202Kp],
			foreignColumns: [users.id],
			name: "ketPetugas_r202KP_users_id_fk"
		}),
	foreignKey({
			columns: [table.r204KPr],
			foreignColumns: [users.id],
			name: "ketPetugas_r204KPr_users_id_fk"
		}),
	foreignKey({
			columns: [table.keluargaId],
			foreignColumns: [keluarga.id],
			name: "ketPetugas_keluargaId_keluarga_id_fk"
		}),
	check("ketPetugas_id_not_null", sql`NOT NULL id`),
	check("ketPetugas_r201TP_not_null", sql`NOT NULL "r201TP"`),
	check("ketPetugas_r202NP_not_null", sql`NOT NULL "r202NP"`),
	check("ketPetugas_r202KP_not_null", sql`NOT NULL "r202KP"`),
	check("ketPetugas_r203TPr_not_null", sql`NOT NULL "r203TPr"`),
	check("ketPetugas_r204NPr_not_null", sql`NOT NULL "r204NPr"`),
	check("ketPetugas_r204KPr_not_null", sql`NOT NULL "r204KPr"`),
	check("ketPetugas_r205HP_not_null", sql`NOT NULL "r205HP"`),
	check("ketPetugas_keluargaId_not_null", sql`NOT NULL "keluargaId"`),
]);

export const disabilitas = pgTable("disabilitas", {
	id: serial().primaryKey().notNull(),
	keluargaId: integer().notNull(),
	r601D: varchar(),
	r602Td: varchar(),
	r602Tw: varchar(),
	r602Tn: varchar(),
	r602Tl: varchar(),
	r602TlNama: varchar(),
	r602Ns: boolean(),
	r602Id: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.keluargaId],
			foreignColumns: [keluarga.id],
			name: "disabilitas_keluargaId_keluarga_id_fk"
		}),
	foreignKey({
			columns: [table.r602Id],
			foreignColumns: [anggotaKeluarga.id],
			name: "disabilitas_r602id_anggotaKeluarga_id_fk"
		}),
	check("disabilitas_id_not_null", sql`NOT NULL id`),
	check("disabilitas_keluargaId_not_null", sql`NOT NULL "keluargaId"`),
	check("disabilitas_r602id_not_null", sql`NOT NULL r602id`),
]);

export const ketenagakerjaan = pgTable("ketenagakerjaan", {
	id: serial().primaryKey().notNull(),
	anggotaKeluargaId: integer().notNull(),
	r317B: varchar(),
	r318Lu: varchar(),
	r319Sp: varchar(),
	r320Ku: varchar(),
	r321L: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.anggotaKeluargaId],
			foreignColumns: [anggotaKeluarga.id],
			name: "ketenagakerjaan_anggotaKeluargaId_anggotaKeluarga_id_fk"
		}),
	check("ketenagakerjaan_id_not_null", sql`NOT NULL id`),
	check("ketenagakerjaan_anggotaKeluargaId_not_null", sql`NOT NULL "anggotaKeluargaId"`),
]);

export const ketPerumahan = pgTable("ketPerumahan", {
	id: serial().primaryKey().notNull(),
	keluargaId: integer().notNull(),
	r401Ll: doublePrecision(),
	r402Sk: varchar(),
	r403Bk: varchar(),
	r404Sam: varchar(),
	r405Fb: varchar(),
	r406Pu: varchar(),
	r407D: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.keluargaId],
			foreignColumns: [keluarga.id],
			name: "ketPerumahan_keluargaId_keluarga_id_fk"
		}),
	check("ketPerumahan_id_not_null", sql`NOT NULL id`),
	check("ketPerumahan_keluargaId_not_null", sql`NOT NULL "keluargaId"`),
]);

export const ketPerumahanBlok2 = pgTable("ketPerumahanBlok2", {
	id: serial().primaryKey().notNull(),
	keluargaId: integer().notNull(),
	r408Lps: doublePrecision(),
	r409Lpk: doublePrecision(),
	r410LpKo: doublePrecision(),
	r411A: integer(),
	r412K: integer(),
	r413S: integer(),
}, (table) => [
	foreignKey({
			columns: [table.keluargaId],
			foreignColumns: [keluarga.id],
			name: "ketPerumahanBlok2_keluargaId_keluarga_id_fk"
		}),
	check("ketPerumahanBlok2_id_not_null", sql`NOT NULL id`),
	check("ketPerumahanBlok2_keluargaId_not_null", sql`NOT NULL "keluargaId"`),
]);
