import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard/dashboard.controller";
import { AuthModule } from "src/auth/auth.module";
import { DashboardService } from "./dashboard/dashboard.service";
import { ExpenseHistoryService } from "./expense-history.service";
import { ExpenseCategoryService } from "./expense-category/expense-category.service";
import { ExpenseCategoryController } from "./expense-category/expense-category.controller";
import { UsersModule } from "src/users/users.module";

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
        ExpenseHistoryService
    ],
    exports: [
        DashboardService,
        ExpenseCategoryService,
        ExpenseHistoryService
    ]
})
export class ExpenseModule {}