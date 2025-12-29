import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { GuardsModule } from './guards/guards.module';
import { UtilsModule } from './utils/utils.module';

@Module({
    imports: [
        DatabaseModule,
        GuardsModule,
        UtilsModule
    ],
    exports: [
        DatabaseModule,
        GuardsModule,
        UtilsModule
    ]
})
export class SharedModule {}
