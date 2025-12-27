import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard/dashboard.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        AuthModule
    ],
    controllers: [
        DashboardController
    ]
})
export class ExpenseModule {}