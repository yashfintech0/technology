import { timestamps } from "@utils/timestamps";
import { relations } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";

export const categoryTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  parentId: uuid("parent_id").references((): AnyPgColumn => categoryTable.id),
  ...timestamps,
});

export const categoriesRelations = relations(
  categoryTable,
  ({ many, one }) => ({
    subcategories: many(categoryTable, { relationName: "subcategories" }),
    parent: one(categoryTable, {
      fields: [categoryTable.parentId],
      references: [categoryTable.id],
      relationName: "subcategories",
    }),
  }),
);

export type insertCategory = typeof categoryTable.$inferInsert;
export type selectCategory = typeof categoryTable.$inferSelect;
