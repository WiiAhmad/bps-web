CREATE TABLE "anggotaKeluarga" (
	"id" serial PRIMARY KEY NOT NULL,
	"keluargaId" integer NOT NULL,
	"r301NU" integer NOT NULL,
	"r302NL" varchar NOT NULL,
	"r303NIK" varchar NOT NULL,
	"r304JK" integer NOT NULL,
	"r305HK" integer NOT NULL,
	"r306SK" integer NOT NULL,
	"r307TL" varchar NOT NULL,
	"r308TGL" date NOT NULL,
	"r309UM" integer NOT NULL,
	"r310AG" integer NOT NULL,
	"r311KI" integer NOT NULL,
	"r312DOM" integer NOT NULL,
	"r313PS" integer NOT NULL,
	"r314TP" integer NOT NULL,
	"r315KT" integer NOT NULL,
	"r316IT" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bantuan" (
	"id" serial PRIMARY KEY NOT NULL,
	"keluargaId" integer NOT NULL,
	"r501B1T" integer,
	"r502BPKH" integer,
	"r502BBPNT" integer,
	"r502BOS" integer,
	"r502BAPANAS" integer,
	"r502BSTUNTING" integer,
	"r502BKIS" integer,
	"r502BBLT" integer,
	"r502BLNama" integer,
	"r502BLStatus" integer,
	"r503id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disabilitas" (
	"id" serial PRIMARY KEY NOT NULL,
	"keluargaId" integer NOT NULL,
	"r601D" boolean,
	"r602TD" boolean,
	"r602TW" boolean,
	"r602TN" boolean,
	"r602TL" boolean,
	"r602TLNama" varchar,
	"r602TLStatus" boolean,
	"r602id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "keluarga" (
	"id" serial PRIMARY KEY NOT NULL,
	"r108NKK" varchar NOT NULL,
	"r109AK" integer NOT NULL,
	"r110NKK" varchar NOT NULL,
	"r111AL" text NOT NULL,
	"mfdId" integer NOT NULL,
	"rNote" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ketPetugas" (
	"id" serial PRIMARY KEY NOT NULL,
	"r201TP" date NOT NULL,
	"r202NP" varchar NOT NULL,
	"r202KP" integer NOT NULL,
	"r203TPr" date NOT NULL,
	"r204NPr" varchar NOT NULL,
	"r204KPr" integer NOT NULL,
	"r205HP" varchar NOT NULL,
	"keluargaId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ketenagakerjaan" (
	"id" serial PRIMARY KEY NOT NULL,
	"anggotaKeluargaId" integer NOT NULL,
	"r317B" integer,
	"r318LU" integer,
	"r319SP" integer,
	"r320KU" integer,
	"r321L" integer
);
--> statement-breakpoint
CREATE TABLE "ketPerumahan" (
	"id" serial PRIMARY KEY NOT NULL,
	"keluargaId" integer NOT NULL,
	"r401LL" integer,
	"r402Sk" integer,
	"r403BK" integer,
	"r404SAM" integer,
	"r405FB" integer,
	"r406PU" integer,
	"r407D" integer
);
--> statement-breakpoint
CREATE TABLE "ketPerumahanBlok2" (
	"id" serial PRIMARY KEY NOT NULL,
	"keluargaId" integer NOT NULL,
	"r408LPS" integer,
	"r409LPK" integer,
	"r410LPKo" integer,
	"r411A" integer,
	"r412K" integer,
	"r413S" integer
);
--> statement-breakpoint
CREATE TABLE "mfd" (
	"id" serial PRIMARY KEY NOT NULL,
	"r101Pro" varchar NOT NULL,
	"r101KPro" varchar NOT NULL,
	"r102Kab" varchar NOT NULL,
	"r102KKab" varchar NOT NULL,
	"r103Kec" varchar NOT NULL,
	"r103KKec" varchar NOT NULL,
	"r104Des" varchar NOT NULL,
	"r104KDes" varchar NOT NULL,
	"r105Dus" varchar NOT NULL,
	"r105KDus" varchar NOT NULL,
	"r106SLS" varchar NOT NULL,
	"r106KSLS" varchar NOT NULL,
	"r107SSLS" varchar NOT NULL,
	"r107KSSLS" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" varchar NOT NULL,
	"email" varchar NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"photo" varchar NOT NULL,
	"tanggal_lahir" date NOT NULL,
	"NoTelpon" varchar NOT NULL,
	"role" varchar DEFAULT 'user' NOT NULL,
	"alamat" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now() NOT NULL,
	"deleted" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "anggotaKeluarga" ADD CONSTRAINT "anggotaKeluarga_keluargaId_keluarga_id_fk" FOREIGN KEY ("keluargaId") REFERENCES "public"."keluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bantuan" ADD CONSTRAINT "bantuan_keluargaId_keluarga_id_fk" FOREIGN KEY ("keluargaId") REFERENCES "public"."keluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bantuan" ADD CONSTRAINT "bantuan_r503id_anggotaKeluarga_id_fk" FOREIGN KEY ("r503id") REFERENCES "public"."anggotaKeluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disabilitas" ADD CONSTRAINT "disabilitas_keluargaId_keluarga_id_fk" FOREIGN KEY ("keluargaId") REFERENCES "public"."keluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disabilitas" ADD CONSTRAINT "disabilitas_r602id_anggotaKeluarga_id_fk" FOREIGN KEY ("r602id") REFERENCES "public"."anggotaKeluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "keluarga" ADD CONSTRAINT "keluarga_mfdId_mfd_id_fk" FOREIGN KEY ("mfdId") REFERENCES "public"."mfd"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ketPetugas" ADD CONSTRAINT "ketPetugas_r202KP_users_id_fk" FOREIGN KEY ("r202KP") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ketPetugas" ADD CONSTRAINT "ketPetugas_r204KPr_users_id_fk" FOREIGN KEY ("r204KPr") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ketPetugas" ADD CONSTRAINT "ketPetugas_keluargaId_keluarga_id_fk" FOREIGN KEY ("keluargaId") REFERENCES "public"."keluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ketenagakerjaan" ADD CONSTRAINT "ketenagakerjaan_anggotaKeluargaId_anggotaKeluarga_id_fk" FOREIGN KEY ("anggotaKeluargaId") REFERENCES "public"."anggotaKeluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ADD CONSTRAINT "ketPerumahan_keluargaId_keluarga_id_fk" FOREIGN KEY ("keluargaId") REFERENCES "public"."keluarga"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ketPerumahanBlok2" ADD CONSTRAINT "ketPerumahanBlok2_keluargaId_keluarga_id_fk" FOREIGN KEY ("keluargaId") REFERENCES "public"."keluarga"("id") ON DELETE no action ON UPDATE no action;