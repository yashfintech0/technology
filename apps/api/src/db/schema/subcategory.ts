import { timestamps } from "@utils/timestamps";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { categoryTable } from "./category";

export const subcategoryTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("website_id").references(() => categoryTable.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  ...timestamps,
});

export type insertSubcategory = typeof subcategoryTable.$inferInsert;
export type selectSubcategory = typeof subcategoryTable.$inferSelect;
