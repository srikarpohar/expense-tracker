import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import { type Response, type Request } from "express";
import { DashboardService } from "./dashboard.service";
import { AddExpenseRequestDto, AddExpenseResponseDTO, GetCalendarDataRequest, GetCalendarDataResponse, GetMonthlyCurrencyDataRequest, GetMonthlyCurrencyDataResponse, IUserPayload } from "expense-tracker-shared";
import { ResponseDto } from "src/types";

@Controller("dashboard")
export class DashboardController {

    constructor(
        private readonly dashboardService: DashboardService,
    ) {}

    @Get("currency")
    async getMonthlyCurrencyData(
        @Req() req: Request<any, any, any, GetMonthlyCurrencyDataRequest>,
        @Res() res: Response<ResponseDto<GetMonthlyCurrencyDataResponse[]>>
    ) {
        const { query } = req;
        const user = req["user"] as IUserPayload;
        const result = await this.dashboardService.getMonthlyCurrencyData(user.sub, query.startDate, query.endDate);

        res.status(200).send({
            data: result,
            statusCode: 201
        });
    }
    
    @Get("calendar")
    async getCalendarData(
        @Req() req: Request<any, any, any, GetCalendarDataRequest>,
        @Res() res: Response<ResponseDto<GetCalendarDataResponse[]>>
    ) {
        const { query } = req;
        const user = req["user"] as IUserPayload;
        const result = await this.dashboardService.getCalendarData(user.sub, query.startDate, query.endDate);

        res.status(200).send({
            data: result,
            statusCode: 200
        });
    }

    @Post("")
    async addExpense(
        @Req() req: Request<any, any, AddExpenseRequestDto, any, {user: IUserPayload}>,
        @Res() res: Response<ResponseDto<AddExpenseResponseDTO>>
    ) {
        const { body } = req;
        const user = req["user"];

        const result = await this.dashboardService.addExpense(body, user as IUserPayload);

        res.status(201).send({
            data: {
                expense_id: result.expense_id as number
            },
            statusCode: 200 
        });
    }
}