import { Inject, Injectable } from "@nestjs/common";
import {IUser} from "expense-tracker-shared";
import bcrypt from "bcryptjs";
import postgres from "postgres";
import { PgDatabaseConnectionService } from "src/shared/database/db.connection";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
    @Inject()
    private readonly dbConnection: PgDatabaseConnectionService;

    constructor(
        private readonly configService: ConfigService
    ) {
    }

    getJwtPayload(userData: IUser) {
        return {
            sub: userData.user_id as number,
            username: userData.username
        }
    }

    async encryptData(data: string): Promise<string> {
        const saltRounds = this.configService.get<number>('password_salt') || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedData = await bcrypt.hash(data, salt);

        return hashedData;
    }

    async create(user: IUser): Promise<postgres.Row | undefined> {
        user.password = await this.encryptData(user.password);
        const createdUser = await this.dbConnection.sqlInstance`
            INSERT INTO users
            ${this.dbConnection.sqlInstance(user, ['username', 'email', 'password', 'phone_number', 'country_code'])}
            RETURNING *;
        `;
        return createdUser.at(0);
    }

    async findUserByField(field: string, value: string): Promise<IUser | null> {
        const result = await this.dbConnection.sqlInstance`
            SELECT user_id FROM users WHERE ${this.dbConnection.sqlInstance(field)} = ${value} LIMIT 1;
        `;
        return result.length > 0 ? result[0] as IUser : null;
    }
}