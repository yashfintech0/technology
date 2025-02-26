import { httpStatus, httpStatusCode } from "@customtype/http";
import db from "@db/index";
import {
  articleSectionTable,
  articleTable,
  insertSection,
  sectionTable,
} from "@db/schema";
import SectionService from "@services/section";
import ApiError from "@utils/apiError";
import asyncHandler from "@utils/asynHandler";
import { Base } from "@utils/baseResponse";
import logger from "@utils/logger";
import { and, ilike, SQL, count, desc, eq, getTableColumns } from "drizzle-orm";
import { Router, Request, Response } from "express";
import { apiMiddleware } from "middleware/apiMiddleware";

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
    this.router.post(
      "/sections/articles",
      apiMiddleware,
      this.addArticleSection,
    );
    this.router.get("/sections/:sectionId/articles", this.getSectionArticles);
    this.router.delete(
      "/sections/articles/:id",
      apiMiddleware,
      this.deleteArticleSection,
    );

    this.router.post("/sections", apiMiddleware, this.addSection);
    this.router.get("/sections", this.getSections);
    this.router.put("/sections", apiMiddleware, this.updateSection);
    this.router.delete(
      "/sections/:sectionId",
      apiMiddleware,
      this.deleteSection,
    );
    this.router.get("/sections/:sectionId", this.getSectionDetailsById);
  }

  private getSectionDetailsById = asyncHandler(
    async (req: Request, res: Response) => {
      const { sectionId } = req.params;
      const section = await this.sectionService.getSectionById(
        sectionId as string,
      );
      if (!section)
        throw new ApiError(
          "Section does not exist.",
          httpStatusCode.BAD_REQUEST,
        );
      return this.response(
        res,
        httpStatusCode.OK,
        httpStatus.SUCCESS,
        "Section details fetched successfully",
        section,
      );
    },
  );

  private addArticleSection = asyncHandler(
    async (req: Request, res: Response) => {
      const { articleIds, sectionId } = req.body;
      logger.info(
        `Linking article to section: articleId=${articleIds}, sectionId=${sectionId}`,
      );

      const result = await Promise.all(
        articleIds.map((id: string) =>
          this.sectionService.addArticleSection({
            articleId: id,
            sectionId,
          }),
        ),
      );

      if (!result.length) {
        logger.error(
          `Error while linking article to section: articleId=${articleIds}, sectionId=${sectionId}`,
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

  private getSectionArticles = asyncHandler(
    async (req: Request, res: Response) => {
      const { sectionId } = req.params;
      const { perRow = "1" } = req.query;
      logger.info("Fetching article-section links");

      const { ...rest } = getTableColumns(articleTable);
      const perPageRow = Math.max(1, Number(perRow));

      const result = await db
        .select({ ...rest, articleSectionId: articleSectionTable.id })
        .from(articleSectionTable)
        .where(eq(articleSectionTable.sectionId, sectionId as string))
        .leftJoin(
          articleTable,
          eq(articleSectionTable.articleId, articleTable.id),
        )
        .limit(perPageRow);

      logger.info(
        `Article-section links fetched successfully: count=${result.length}`,
      );
      this.response(
        res,
        httpStatusCode.OK,
        httpStatus.SUCCESS,
        "Article section fetched successfully.",
        result,
      );
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
    const { page = "1", perRow = "20", search } = req.query;

    // Parse pagination parameters
    const currentPage = Math.max(1, Number(page));
    const perPageRow = Math.max(1, Number(perRow));
    const skip = (currentPage - 1) * perPageRow;

    // Build filters
    const filters: SQL[] = [];
    if (search && typeof search === "string" && search.length > 0) {
      filters.push(ilike(sectionTable.name, `%${search}%`));
    }

    // Fetch total count and sections in parallel
    const [totalCountResult, sections] = await Promise.all([
      db
        .select({ count: count() })
        .from(sectionTable)
        .where(and(...filters)),
      db
        .select()
        .from(sectionTable)
        .where(and(...filters))
        .limit(perPageRow)
        .offset(skip)
        .orderBy(desc(sectionTable.createdAt)),
    ]);

    // Fetch article counts for all sections in parallel
    const sectionsWithArticleCounts = await Promise.all(
      sections.map(async (section) => {
        const articleCountResult = await db
          .select({ count: count() })
          .from(articleSectionTable)
          .where(eq(articleSectionTable.sectionId, section.id));
        return {
          ...section,
          articleCount: articleCountResult[0]?.count || 0,
        };
      }),
    );

    // Prepare the response
    const result = {
      totalCount: totalCountResult[0]?.count || 0,
      sections: sectionsWithArticleCounts,
    };

    logger.info("Sections fetched successfully");

    return this.response(
      res,
      httpStatusCode.OK,
      httpStatus.SUCCESS,
      "Sections fetched successfully.",
      result,
    );
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
