import { updateResponse } from "@customtype/index";
import db from "@db/index";
import { categoryTable, insertCategory } from "@db/schema";
import { eq } from "drizzle-orm";

class CategoryService {
  constructor() {}

  async updateCategory(
    categoryId: string,
    name: string,
  ): Promise<updateResponse> {
    const [result] = await db
      .update(categoryTable)
      .set({ name })
      .where(eq(categoryTable.id, categoryId))
      .returning({ name: categoryTable.name });
    if (!result || !result.name) {
      return { updated: false };
    } else {
      return { updated: true, name: result.name };
    }
  }

  async deleteCategory(categoryId: string) {
    const result = await db
      .delete(categoryTable)
      .where(eq(categoryTable.id, categoryId))
      .returning({ name: categoryTable.name });
    return result;
  }

  async addCategory(data: insertCategory) {
    return await db.insert(categoryTable).values(data);
  }
}

export default CategoryService;
