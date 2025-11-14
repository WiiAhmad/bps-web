import { relations } from "drizzle-orm/relations";
import { mfd, keluarga, anggotaKeluarga, bantuan, users, ketPetugas, disabilitas, ketenagakerjaan, ketPerumahan, ketPerumahanBlok2 } from "./schema";

export const keluargaRelations = relations(keluarga, ({one, many}) => ({
	mfd: one(mfd, {
		fields: [keluarga.mfdId],
		references: [mfd.id]
	}),
	anggotaKeluargas: many(anggotaKeluarga),
	bantuans: many(bantuan),
	ketPetugases: many(ketPetugas),
	disabilitas: many(disabilitas),
	ketPerumahans: many(ketPerumahan),
	ketPerumahanBlok2s: many(ketPerumahanBlok2),
}));

export const mfdRelations = relations(mfd, ({many}) => ({
	keluargas: many(keluarga),
}));

export const anggotaKeluargaRelations = relations(anggotaKeluarga, ({one, many}) => ({
	keluarga: one(keluarga, {
		fields: [anggotaKeluarga.keluargaId],
		references: [keluarga.id]
	}),
	bantuans: many(bantuan),
	disabilitas: many(disabilitas),
	ketenagakerjaans: many(ketenagakerjaan),
}));

export const bantuanRelations = relations(bantuan, ({one}) => ({
	keluarga: one(keluarga, {
		fields: [bantuan.keluargaId],
		references: [keluarga.id]
	}),
	anggotaKeluarga: one(anggotaKeluarga, {
		fields: [bantuan.r503Id],
		references: [anggotaKeluarga.id]
	}),
}));

export const ketPetugasRelations = relations(ketPetugas, ({one}) => ({
	user_r202Kp: one(users, {
		fields: [ketPetugas.r202Kp],
		references: [users.id],
		relationName: "ketPetugas_r202Kp_users_id"
	}),
	user_r204KPr: one(users, {
		fields: [ketPetugas.r204KPr],
		references: [users.id],
		relationName: "ketPetugas_r204KPr_users_id"
	}),
	keluarga: one(keluarga, {
		fields: [ketPetugas.keluargaId],
		references: [keluarga.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	ketPetugases_r202Kp: many(ketPetugas, {
		relationName: "ketPetugas_r202Kp_users_id"
	}),
	ketPetugases_r204KPr: many(ketPetugas, {
		relationName: "ketPetugas_r204KPr_users_id"
	}),
}));

export const disabilitasRelations = relations(disabilitas, ({one}) => ({
	keluarga: one(keluarga, {
		fields: [disabilitas.keluargaId],
		references: [keluarga.id]
	}),
	anggotaKeluarga: one(anggotaKeluarga, {
		fields: [disabilitas.r602Id],
		references: [anggotaKeluarga.id]
	}),
}));

export const ketenagakerjaanRelations = relations(ketenagakerjaan, ({one}) => ({
	anggotaKeluarga: one(anggotaKeluarga, {
		fields: [ketenagakerjaan.anggotaKeluargaId],
		references: [anggotaKeluarga.id]
	}),
}));

export const ketPerumahanRelations = relations(ketPerumahan, ({one}) => ({
	keluarga: one(keluarga, {
		fields: [ketPerumahan.keluargaId],
		references: [keluarga.id]
	}),
}));

export const ketPerumahanBlok2Relations = relations(ketPerumahanBlok2, ({one}) => ({
	keluarga: one(keluarga, {
		fields: [ketPerumahanBlok2.keluargaId],
		references: [keluarga.id]
	}),
}));