import { timestamps } from "@utils/timestamps";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { categoryTable } from "./category";
import { text, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const articleTable = pgTable("article", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: uuid("category_id").references(() => categoryTable.id),
  isPublished: boolean("is_published").default(false).notNull(),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  ...timestamps,
});

export type insertArticle = typeof articleTable.$inferInsert;
export type selectArticle = typeof articleTable.$inferSelect;
