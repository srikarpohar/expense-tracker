import { Controller, Post, Req, Res } from "@nestjs/common";
import type { AddExpenseCategoryRequestDto, AddExpenseCategoryResponseDto } from "expense-tracker-types";
import type { Response, Request } from "express";
import { ExpenseCategoryService } from "./expense-category.service";

@Controller("expense-category")
export class ExpenseCategoryController {

    constructor(
        private expenseCategoryService: ExpenseCategoryService
    ) {}

    @Post()
    async addExpenseCategory(
        @Req() req: Request<any, any, AddExpenseCategoryRequestDto>,
        @Res() res: Response<AddExpenseCategoryResponseDto>
    ) {
        const { body } = req;
        const categoryId = await this.expenseCategoryService.createCategoryIfNotPresent(body.name);

        res.status(200).send({id: categoryId});
    }
}