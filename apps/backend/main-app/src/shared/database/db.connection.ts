import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres, { Sql } from 'postgres';

export class PgDatabaseConnectionService {
    readonly sqlInstance: Sql;
    
    constructor(
        @Inject() private configService: ConfigService
    ) {
        this.sqlInstance = postgres(
            this.configService.get<string>('primaryDb.connectionUri') || '', 
            this.configService.get<postgres.Options<any>>('primaryDb.options') || {}
        );
    }

}