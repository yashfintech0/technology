import { httpStatus, httpStatusCode } from "@customtype/http";
import db from "@db/index";
import { insertarticleSection, insertSection } from "@db/schema";
import SectionService from "@services/section";
import ApiError from "@utils/apiError";
import asyncHandler from "@utils/asynHandler";
import { Base } from "@utils/baseResponse";
import logger from "@utils/logger";
import { Router, Request, Response } from "express";

class SectionController extends Base {
  router: Router;
  private sectionService: SectionService;

  constructor() {
    super();
    this.router = Router();
    this.sectionService = new SectionService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Article-Section routes
    this.router.post("/sections/article", this.addArticleSection);
    this.router.get("/sections/article", this.getArticleSections);
    this.router.delete("/sections/article/:id", this.deleteArticleSection);

    this.router.post("/sections", this.addSection);
    this.router.get("/sections", this.getSections);
    this.router.put("/sections", this.updateSection);
    this.router.delete("/sections/:sectionId", this.deleteSection);
  }

  private addArticleSection = asyncHandler(
    async (req: Request, res: Response) => {
      const { articleId, sectionId } = req.body;
      logger.info(
        `Linking article to section: articleId=${articleId}, sectionId=${sectionId}`,
      );

      const articleSectionData: insertarticleSection = { articleId, sectionId };
      const result =
        await this.sectionService.addArticleSection(articleSectionData);

      if (!result || !result.id) {
        logger.error(
          `Error while linking article to section: articleId=${articleId}, sectionId=${sectionId}`,
        );
        throw new ApiError(
          "Something went wrong while linking article to section.",
          httpStatusCode.BAD_REQUEST,
        );
      }

      const message = `Article linked to section successfully.`;
      logger.info(message);
      return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
    },
  );

  private getArticleSections = asyncHandler(
    async (req: Request, res: Response) => {
      logger.info("Fetching article-section links");

      const result = await db.query.articleSectionTable.findMany();

      logger.info(
        `Article-section links fetched successfully: count=${result.length}`,
      );
      return res.status(httpStatusCode.OK).json({ result });
    },
  );

  private deleteArticleSection = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      logger.info(`Deleting article-section link: id=${id}`);

      const [result] = await this.sectionService.deleteArticleSection(
        id as string,
      );

      if (!result) {
        logger.warn(`Article-section link not found for deletion: id=${id}`);
        throw new ApiError(
          "Article-section link does not exist.",
          httpStatusCode.BAD_REQUEST,
        );
      }

      const message = `Article-section link deleted successfully.`;
      logger.info(message);
      return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
    },
  );

  private addSection = asyncHandler(async (req: Request, res: Response) => {
    const { name, isMain } = req.body;
    logger.info(`Adding new section: name=${name}, isMain=${isMain}`);

    const sectionData: insertSection = { name, isMain };
    const result = await this.sectionService.addSection(sectionData);

    if (!result || !result.id) {
      logger.error(`Error while creating section: name=${name}`);
      throw new ApiError(
        "Something went wrong while creating the section.",
        httpStatusCode.BAD_REQUEST,
      );
    }

    const message = `The section '${name}' has been created successfully.`;
    logger.info(`Section created successfully: name=${name}`);
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });

  private getSections = asyncHandler(async (req: Request, res: Response) => {
    logger.info("Fetching sections");

    const result = await db.query.sectionTable.findMany({});

    logger.info(`Sections fetched successfully: count=${result.length}`);
    this.response(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Ssection fetched successfully.",
      result,
    );
    return res.status(httpStatusCode.OK).json({ result });
  });

  private updateSection = asyncHandler(async (req: Request, res: Response) => {
    const { sectionId, name, isMain } = req.body;
    logger.info(`Updating section: sectionId=${sectionId}`);

    const result = await this.sectionService.updateSection(sectionId, {
      name,
      isMain,
    });

    if (!result.updated) {
      logger.warn(`Section not found: sectionId=${sectionId}`);
      throw new ApiError("Section does not exist.", httpStatusCode.BAD_REQUEST);
    }

    const message = `The section '${name}' has been updated successfully.`;
    logger.info(`Section updated successfully: sectionId=${sectionId}`);
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });

  private deleteSection = asyncHandler(async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    logger.info(`Deleting section: sectionId=${sectionId}`);

    const [result] = await this.sectionService.deleteSection(
      sectionId as string,
    );

    if (!result) {
      logger.warn(`Section not found for deletion: sectionId=${sectionId}`);
      throw new ApiError("Section does not exist.", httpStatusCode.BAD_REQUEST);
    }

    const message = `The section '${result.name}' has been deleted successfully.`;
    logger.info(`Section deleted successfully: sectionId=${sectionId}`);
    return this.response(res, httpStatusCode.OK, httpStatus.SUCCESS, message);
  });
}

export default new SectionController().router;
