import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard/dashboard.controller";
import { AuthModule } from "src/auth/auth.module";
import { DashboardService } from "./dashboard/dashboard.service";
import { ExpenseCatgeoryService } from './expense-catgeory.service';
import { DatabaseModule } from "src/shared/database/database.module";
import { ExpenseHistoryService } from "./expense-history.service";

@Module({
    imports: [
        AuthModule,
        DatabaseModule
    ],
    controllers: [
        DashboardController
    ],
    providers: [
        DashboardService,
        ExpenseCatgeoryService,
        ExpenseHistoryService
    ]
})
export class ExpenseModule {}