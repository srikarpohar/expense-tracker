import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard/dashboard.controller";
import { AuthModule } from "src/auth/auth.module";
import { DashboardService } from "./dashboard/dashboard.service";
import { DatabaseModule } from "src/shared/database/database.module";
import { ExpenseHistoryService } from "./expense-history.service";
import { ExpenseCategoryService } from "./expense-category/expense-category.service";
import { ExpenseCategoryController } from "./expense-category/expense-category.controller";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [
        AuthModule,
        DatabaseModule,
        UsersModule
    ],
    controllers: [
        DashboardController,
        ExpenseCategoryController
    ],
    providers: [
        DashboardService,
        ExpenseCategoryService,
        ExpenseHistoryService
    ]
})
export class ExpenseModule {}