import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard/dashboard.controller";
import { AuthModule } from "src/auth/auth.module";
import { DashboardService } from "./dashboard/dashboard.service";
import { ExpenseHistoryService } from "./expense-history.service";
import { ExpenseCategoryService } from "./expense-category/expense-category.service";
import { ExpenseCategoryController } from "./expense-category/expense-category.controller";
import { UsersModule } from "src/users/users.module";
import { ExpenseRepository } from "./expense.repository";

@Module({
    imports: [
        AuthModule,
        UsersModule,
    ],
    controllers: [
        DashboardController,
        ExpenseCategoryController
    ],
    providers: [
        DashboardService,
        ExpenseCategoryService,
        ExpenseHistoryService,
        ExpenseRepository
    ],
    exports: [
        DashboardService,
        ExpenseCategoryService,
        ExpenseHistoryService,
        ExpenseRepository
    ]
})
export class ExpenseModule {}