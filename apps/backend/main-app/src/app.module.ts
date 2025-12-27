import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import configuration from './configuration/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGaurd } from './shared/guards/auth.guard';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    AuthModule,
    SharedModule,
    ExpenseModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGaurd
    }
  ],
})
export class AppModule {}
