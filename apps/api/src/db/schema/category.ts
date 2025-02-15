import { timestamps } from "@utils/timestamps";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const categoryTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  // websiteId: uuid("website_id").references(() => websites.id, {
  //   onDelete: "cascade",
  // }),
  name: varchar("name", { length: 255 }).notNull(),
  websiteId: uuid("website_id").notNull(),
  ...timestamps,
});

export type insertCategory = typeof categoryTable.$inferInsert;
export type selectCategory = typeof categoryTable.$inferSelect;
