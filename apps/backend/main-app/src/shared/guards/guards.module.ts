import { Module } from '@nestjs/common';
import { AuthGaurd } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule
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
