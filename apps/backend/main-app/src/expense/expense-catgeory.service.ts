import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { IExpenseCategory } from 'expense-tracker-shared';
import { PgDatabaseConnectionService } from 'src/shared/database/db.connection';

@Injectable()
export class ExpenseCatgeoryService {

    constructor(
        private readonly dbConnection: PgDatabaseConnectionService
    ) {}

    async checkIfCategoryExistsWithName(name: string): Promise<boolean> {
        const result: IExpenseCategory[] = await this.dbConnection.sqlInstance`
            SELECT name from expense_category WHERE name=${name};
        `;

        return result.length ? true : false;
    }

    async createCategory(name: string): Promise<number | null> {
        try {
            const categoryDoc = {
                name: name
            };
            const createdCategory = await this.dbConnection.sqlInstance`
                INSERT INTO expense_category
                ${this.dbConnection.sqlInstance(categoryDoc, ["name"])}
                RETURNING *
            `;

            return createdCategory.length ? (createdCategory[0] as IExpenseCategory).id as number : null;
        } catch(error: any) {
            if(error.code == 23505) {
                throw new ConflictException({
                    status: HttpStatus.CONFLICT,
                    data: null,
                    errorMessage: "Category already exists with given name"
                })
            }
            console.log(error);
        }

        return null;
    }

}
