import { httpStatus, httpStatusCode } from "@customtype/http";
import db from "@db/index";
import { insertArticle } from "@db/schema";
import ArticleService from "@services/article";
import ApiError from "@utils/apiError";
import asyncHandler from "@utils/asynHandler";
import { Base } from "@utils/baseResponse";
import { createSlug } from "@utils/index";
import logger from "@utils/logger";
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
  }

  private addArticle = asyncHandler(async (req: Request, res: Response) => {
    const { title, description, categoryId, imageUrl } = req.body;
    logger.info(`Adding new article: title=${title}`);

    const articleData: insertArticle = {
      title,
      description,
      categoryId,
      imageUrl,
      slug: createSlug(title),
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
    logger.info("Fetching articles");

    const result = await db.query.articleTable.findMany({});
    const message = `Articles fetched successfully: count=${result.length}`;
    logger.info(message);
    return this.response(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      message,
      result,
    );
  });

  private updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId, tags, imageUrl, title, description, categoryId } =
      req.body;
    logger.info(`Updating article: articleId=${articleId}, title=${title}`);

    const result = await this.articleService.updateArticle(articleId, {
      title,
      categoryId,
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
