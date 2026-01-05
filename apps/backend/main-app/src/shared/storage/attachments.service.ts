import { PgDatabaseConnectionService } from "../database/db.connection";

export class AttachmentsService {
    constructor(
        private readonly dbConnection: PgDatabaseConnectionService
    ) {}

    // async uploadAttachment(file: File) {
    //     console.log(file);
    // }
}