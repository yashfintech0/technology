ALTER TABLE "article_section" DROP CONSTRAINT "article_section_article_id_sections_id_fk";
--> statement-breakpoint
ALTER TABLE "article_section" ADD COLUMN "section_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "article_section" ADD CONSTRAINT "article_section_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;