import { Global, Module } from "@nestjs/common";
import { PgDatabaseConnectionService } from "./db.connection";

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [PgDatabaseConnectionService],
    exports: [PgDatabaseConnectionService]
})
export class DatabaseModule {}