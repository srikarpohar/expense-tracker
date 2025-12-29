import { Module } from '@nestjs/common';
import { APIUtilsService } from './api_utils.service';

@Module({
    imports: [],
    controllers: [],
    providers: [
        APIUtilsService
    ],
    exports: [
        APIUtilsService
    ]
})
export class UtilsModule {}
