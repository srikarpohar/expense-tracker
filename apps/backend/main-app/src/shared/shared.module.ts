import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { GuardsModule } from './guards/guards.module';

@Module({
    imports: [
        DatabaseModule,
        GuardsModule
    ],
    exports: [
        DatabaseModule,
        GuardsModule
    ]
})
export class SharedModule {}
