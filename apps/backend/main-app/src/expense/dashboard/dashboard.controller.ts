import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { type Response, type Request } from "express";
import { DashboardService } from "./dashboard.service";
import { ExpenseCategoryService } from "../expense-category/expense-category.service";
import { AddExpenseRequestDto, AddExpenseResponseDTO, GetCalendarDataRequest, GetCalendarDataResponse, IUserPayload } from "expense-tracker-shared";

@Controller("dashboard")
export class DashboardController {

    constructor(
        private readonly dashboardService: DashboardService,
        private readonly expenseCategoryService: ExpenseCategoryService
    ) {}
    
    @Get()
    getDashboard(
        @Req() req: Request<any, any, any, GetCalendarDataRequest>,
        @Res() res: Response<GetCalendarDataResponse>
    ) {
        console.log("User info from token:", req["user"]);

        const { query } = req;
        const user = req["user"] as IUserPayload;
        const result = this.dashboardService.getCalendarData(user.sub, query.monthYear);

        res.status(200).send(result);
    }

    @Post()
    async addExpense(
        @Req() req: Request<any, any, AddExpenseRequestDto, any, {user: IUserPayload}>,
        @Res() res: Response<AddExpenseResponseDTO>
    ) {
        const { body } = req;
        const user = req["user"];

        const result = await this.dashboardService.addExpense(body, user as IUserPayload);

        res.status(201).send({
            expense_id: result.expense_id as number
        });
    }
}