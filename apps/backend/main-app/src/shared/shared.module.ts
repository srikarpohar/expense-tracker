import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { GuardsModule } from './guards/guards.module';
import { UtilsModule } from './utils/utils.module';
import { StorageModule } from './storage/storage.module';

@Module({
    imports: [
        DatabaseModule,
        GuardsModule,
        UtilsModule,
        StorageModule
    ],
    exports: [
        DatabaseModule,
        GuardsModule,
        UtilsModule,
        StorageModule
    ]
})
export class SharedModule {}
