import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import type { IExpenseCategory } from 'expense-tracker-types';
import { PgDatabaseConnectionService } from 'src/shared/database/db.connection';

@Injectable()
export class ExpenseCategoryService {

    constructor(
        private readonly dbConnection: PgDatabaseConnectionService
    ) {}

    async getCategoryByName(name: string): Promise<IExpenseCategory | null> {
        const result: IExpenseCategory[] = await this.dbConnection.sqlInstance`
            SELECT id FROM expense_category WHERE name=${name};
        `;

        return result ? result[0] : null;
    }

    async createCategoryIfNotPresent(name: string, description?: string): Promise<number> {
        let createdCategory;
        try {
            let categoryDoc = await this.getCategoryByName(name);
            if(categoryDoc?.id) {
                return categoryDoc.id;
            }
            
            categoryDoc = {
                name: name,
                description: description || name,
            };
            
            createdCategory = await this.dbConnection.sqlInstance`
                INSERT INTO expense_category
                ${this.dbConnection.sqlInstance(categoryDoc, ["name"])}
                RETURNING *
            `;

            return (createdCategory[0] as IExpenseCategory).id as number;
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
        
        return -1;
    }

}
