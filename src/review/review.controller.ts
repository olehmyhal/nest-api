import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { SuccessResponse } from "src/helpers/success.response";
import { CreateReviewDto } from "./dto/create-review.dto";
import { DeleteReviewDto } from "./dto/delete-review.dto";
import { SaveReviewDto } from "./dto/save-review.dto";
import { REVIEW_NOT_FOUND } from "./review.constants";
import { ReviewModel } from "./review.model";
import { ReviewService } from "./review.service";
import { IdValidationPipe } from "src/pipes/ad-validation.pipe";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post("create")
  async post(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("byProduct/:productId")
  async get(@Param("productId", IdValidationPipe) productId: string) {
    return this.reviewService.findByProductionId(productId);
  }

  @Post("save")
  async save(@Body() dto: SaveReviewDto) {}

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id", IdValidationPipe) id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
