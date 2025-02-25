import { httpStatus, httpStatusCode } from "@customtype/http";
import db from "@db/index";
import { articleTable, insertArticle } from "@db/schema";
import ArticleService from "@services/article";
import ApiError from "@utils/apiError";
import asyncHandler from "@utils/asynHandler";
import { Base } from "@utils/baseResponse";
import { createSlug, pagination } from "@utils/index";
import logger from "@utils/logger";
import { and, count, desc, eq, ilike, SQL } from "drizzle-orm";
import { Router, Request, Response } from "express";

class ArticleController extends Base {
  router: Router;
  private articleService: ArticleService;

  constructor() {
    super();
    this.router = Router();
    this.articleService = new ArticleService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/articles", this.addArticle);
    this.router.get("/articles", this.getArticles);
    this.router.put("/articles", this.updateArticle);
    this.router.delete("/articles/:articleId", this.deleteArticle);
    this.router.post("/articles/unpublish", this.unPublish);
  }

  private unPublish = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.body;
    const unPublishArticle =
      await this.articleService.unpublishArticle(articleId);
    if (!unPublishArticle)
      throw new ApiError(
        "Article  does not exist.",
        httpStatusCode.BAD_REQUEST,
      );

    const message = `The Article "${unPublishArticle.title}" has been un publish successfully.`;
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });

  private addArticle = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, categoryId, imageUrl, isPublished, tags } =
      req.body;
    logger.info(req.body);
    logger.info(`Adding new article: title=${title}`);

    const articleData: insertArticle = {
      title,
      description,
      categoryId,
      imageUrl,
      tags,
      slug: createSlug(title),
      isPublished,
    };
    const result = await this.articleService.addArticle(articleData);

    if (!result || !result.id || !result.title) {
      logger.error(`Error while creating article: title=${title}`);
      throw new ApiError(
        "Something went wrong while creating the article.",
        httpStatusCode.BAD_REQUEST,
      );
    }

    const message = `The article '${title}' has been created successfully.`;
    logger.info(`Article created successfully: title=${title}`);
    return this.response(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      message,
      result,
    );
  });

  private getArticles = asyncHandler(async (req: Request, res: Response) => {
    const { page, perRow, search } = req.query;

    let currentPage: number = 1;
    let perPageRow: number = 20;

    if (page && !isNaN(Number(page))) {
      currentPage = Number(page);
    }

    if (perRow && !isNaN(Number(perRow))) {
      perPageRow = Number(perRow);
    }

    const skip = pagination(currentPage, perPageRow);

    const filters: SQL[] = [eq(articleTable.isPublished, true)];
    if (search && search.length) {
      filters.push(ilike(articleTable.title, `%${search}%`));
    }

    const [totalCount, articles] = await Promise.all([
      db
        .select({ count: count() })
        .from(articleTable)
        .where(and(...filters)),
      db
        .select()
        .from(articleTable)
        .where(and(...filters))
        .limit(perPageRow)
        .offset(skip)
        .orderBy(desc(articleTable.createdAt)),
    ]);
    const result = {
      totalCount: totalCount[0]?.count,
      articles,
    };
    return this.response(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Articles fetched successfully.",
      result,
    );
  });

  private updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId, tags, imageUrl, title, description } = req.body;
    logger.info(`Updating article: articleId=${articleId}, title=${title}`);

    const result = await this.articleService.updateArticle(articleId, {
      title,
      description,
      imageUrl,
      tags,
    });

    if (!result.updated) {
      logger.warn(`Article not found: articleId=${articleId}`);
      throw new ApiError("Article does not exist.", httpStatusCode.BAD_REQUEST);
    }

    const message = `The article '${title}' has been updated successfully.`;
    logger.info(`Article updated successfully: articleId=${articleId}`);
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });

  private deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    logger.info(`Deleting article: articleId=${articleId}`);

    const [result] = await this.articleService.deleteArticle(
      articleId as string,
    );

    if (!result || !result.title) {
      logger.warn(`Article not found for deletion: articleId=${articleId}`);
      throw new ApiError("Article does not exist.", httpStatusCode.BAD_REQUEST);
    }

    const message = `The article '${result.title}' has been deleted successfully.`;
    logger.info(`Article deleted successfully: articleId=${articleId}`);
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });
}

export default new ArticleController().router;
