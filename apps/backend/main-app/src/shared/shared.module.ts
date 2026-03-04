import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { GuardsModule } from './guards/guards.module';
import { UtilsModule } from './utils/utils.module';
import { StorageModule } from './storage/storage.module';
import { LoggerModule } from './logger/logger.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';
@Global()
@Module({
    imports: [
        DatabaseModule,
        GuardsModule,
        UtilsModule,
        StorageModule,
        LoggerModule,
        CacheManagerModule
    ],
    exports: [
        DatabaseModule,
        GuardsModule,
        UtilsModule,
        StorageModule,
        LoggerModule,
        CacheManagerModule
    ]
})
export class SharedModule {}
