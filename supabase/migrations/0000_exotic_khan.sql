CREATE TABLE "hyroxbox" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"instagram_id" varchar(255),
	"price" integer NOT NULL,
	"features" text,
	"naver_map_url" varchar(512),
	"region_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hyroxbox_region_id_unique" UNIQUE("region_id")
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "regions_region_name_unique" UNIQUE("region_name")
);
--> statement-breakpoint
ALTER TABLE "hyroxbox" ADD CONSTRAINT "hyroxbox_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;