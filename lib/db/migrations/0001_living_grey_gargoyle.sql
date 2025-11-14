ALTER TABLE "bantuan" RENAME COLUMN "r502BLNama" TO "r502BLS";--> statement-breakpoint
ALTER TABLE "bantuan" RENAME COLUMN "r502BLStatus" TO "r502BLN";--> statement-breakpoint
ALTER TABLE "disabilitas" RENAME COLUMN "r602TLStatus" TO "r602NS";--> statement-breakpoint
ALTER TABLE "disabilitas" ALTER COLUMN "r601D" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "disabilitas" ALTER COLUMN "r602TD" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "disabilitas" ALTER COLUMN "r602TW" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "disabilitas" ALTER COLUMN "r602TN" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "disabilitas" ALTER COLUMN "r602TL" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketenagakerjaan" ALTER COLUMN "r317B" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketenagakerjaan" ALTER COLUMN "r318LU" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketenagakerjaan" ALTER COLUMN "r319SP" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketenagakerjaan" ALTER COLUMN "r320KU" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketenagakerjaan" ALTER COLUMN "r321L" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r401LL" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r402Sk" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r403BK" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r404SAM" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r405FB" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r406PU" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahan" ALTER COLUMN "r407D" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "ketPerumahanBlok2" ALTER COLUMN "r408LPS" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "ketPerumahanBlok2" ALTER COLUMN "r409LPK" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "ketPerumahanBlok2" ALTER COLUMN "r410LPKo" SET DATA TYPE double precision;