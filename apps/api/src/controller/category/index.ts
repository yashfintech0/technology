import { httpStatus, httpStatusCode } from "@customtype/http";
import db from "@db/index";
import { insertCategory } from "@db/schema";
import CategoryService from "@services/category";
import ApiError from "@utils/apiError";
import asyncHandler from "@utils/asynHandler";
import { Base } from "@utils/baseResponse";
import logger from "@utils/logger";
import { Router, Request, Response } from "express";

class CategoryController extends Base {
  router: Router;
  private categoryService: CategoryService;

  constructor() {
    super();
    this.router = Router();
    this.categoryService = new CategoryService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/categories", this.addCategory);
    this.router.get("/categories", this.getCategories);
    this.router.put("/categories", this.updateCategory);
    this.router.delete("/categories/:categoryId", this.deleteCategory);
  }

  private updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, categoryId } = req.body;
    logger.info(`Updating category: categoryId=${categoryId}, name=${name}`);

    const result = await this.categoryService.updateCategory(categoryId, name);
    if (!result.updated) {
      logger.warn(`Category not found: categoryId=${categoryId}`);
      throw new ApiError(
        "Category does not exist.",
        httpStatusCode.BAD_REQUEST,
      );
    }

    const message = `The category '${result.name}' has been updated successfully.`;
    logger.info(
      `Category updated successfully: categoryId=${categoryId}, name=${name}`,
    );
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });

  private getCategories = asyncHandler(async (req: Request, res: Response) => {
    logger.info("Fetching categories");

    const result = await db.query.categoryTable.findMany({
      where: (categories, { isNull }) => isNull(categories.parentId),
      with: { subcategories: true },
    });

    logger.info(`Categories fetched successfully: count=${result.length}`);
    return this.response(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Category fetched successfully.",
      result,
    );
  });

  private deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    logger.info(`Deleting category: categoryId=${categoryId}`);

    const [result] = await this.categoryService.deleteCategory(
      categoryId as string,
    );
    if (!result || !result.name) {
      logger.warn(`Category not found for deletion: categoryId=${categoryId}`);
      throw new ApiError(
        "Category does not exist.",
        httpStatusCode.BAD_REQUEST,
      );
    }

    const message = `The category '${result.name}' has been deleted successfully.`;
    logger.info(
      `Category deleted successfully: categoryId=${categoryId}, name=${result.name}`,
    );
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });

  private addCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, parentId } = req.body;
    logger.info(`Adding new category: name=${name}, parentId=${parentId}`);

    const categoryData: insertCategory = { name, parentId };
    const result = await this.categoryService.addCategory(categoryData);

    if (!result.rowCount || result.rowCount < 1) {
      logger.error(
        `Error while creating category: name=${name}, parentId=${parentId}`,
      );
      throw new ApiError(
        "Something went wrong while creating category.",
        httpStatusCode.BAD_REQUEST,
      );
    }

    const message = `The category '${categoryData.name}' has been created successfully.`;
    logger.info(`Category created successfully: name=${categoryData.name}`);
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });
}

export default new CategoryController().router;
