import { Module } from '@nestjs/common';
import { AuthGaurd } from './auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { UtilsModule } from '../utils/utils.module';
@Module({
    imports: [
        AuthModule,
        UtilsModule
    ],
    controllers: [],
    providers: [
        AuthGaurd,
    ],
    exports: [
        AuthGaurd
    ]
})
export class GuardsModule {}
