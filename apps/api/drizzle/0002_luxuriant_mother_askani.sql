DROP TABLE "subcategories" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "parent_id" uuid;