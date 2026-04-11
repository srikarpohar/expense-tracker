import { Inject } from "@nestjs/common";
import { GetCalendarDataResponse, GetMonthlyCurrencyDataResponse, IExpense } from "expense-tracker-shared";
import { PgDatabaseConnectionService } from "src/shared/database/db.connection";

export class ExpenseRepository {
    @Inject()
    private readonly databaseConnection!: PgDatabaseConnectionService;

    async getDailyExpensesByCategoryAndCurrencyInaDateRange(
        userId: number,
        startDate: Date,
        endDate: Date,
        filters?: {
            name: keyof IExpense,
            value: any
        }[],
    ) {
        const filterStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, "0")}-${startDate.getDate()}`,
            filterEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, "0")}-${endDate.getDate()}`;

        let filterQueries: string[] = [];
        if(filters?.length) {
            for(let filter of filters) {
                filterQueries.push(`${filter.name} = ${filter.value}`);
            }

            filterQueries.join(" AND ")
        }

        const result = await this.databaseConnection.sqlInstance<GetCalendarDataResponse[]>`
            SELECT to_char(cat_expense.created_at, 'YYYY-MM-DD') as expense_date,
                json_agg(
                    json_build_object('category', cat.name, 'country_totals', cat_expense.country_totals)
                    ORDER BY category_id ASC
                ) as category_data
            FROM (
                SELECT created_at, category_id, string_agg(country_code || total_amount, ' | ') AS country_totals
                FROM (
                    SELECT created_at, category_id, country_code, SUM(amount) AS total_amount
                    FROM expense
                    WHERE ${this.databaseConnection.sqlInstance`user_id = ${userId}
                        AND created_at BETWEEN ${filterStartDate} AND ${filterEndDate}`}
                    ${filterQueries.length ? this.databaseConnection.sqlInstance` AND ${filterQueries}` : this.databaseConnection.sqlInstance``}
                    GROUP BY created_at, category_id, country_code
                )
                GROUP BY created_at, category_id
            ) as cat_expense LEFT OUTER JOIN expense_category as cat on cat_expense.category_id = cat.id
            GROUP BY to_char(cat_expense.created_at, 'YYYY-MM-DD')
        `;

        return result;
    }

    async getMonthlyExpensesByCurrencyInaDateRange(
        userId: number,
        startDate: Date,
        endDate: Date
    ) {
        const filterStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, "0")}-${startDate.getDate()}`,
            filterEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, "0")}-${endDate.getDate()}`;
        
        const result = await this.databaseConnection.sqlInstance<GetMonthlyCurrencyDataResponse[]>`
            SELECT country_code, SUM(amount) AS total_amount, 
                COUNT(1) AS total_expenses_count
            FROM expense 
            WHERE user_id = ${userId}
            AND created_at BETWEEN ${filterStartDate} AND ${filterEndDate}
            GROUP BY country_code
        `;

        return result;
    }

    async createExpenseDoc(expenseDoc: IExpense) {
        await this.databaseConnection.sqlInstance`
            INSERT INTO expense
            ${this.databaseConnection.sqlInstance(expenseDoc, ["amount", "category_id", "user_id", "country_code", "name", "notes", "type", "created_at"])}
            RETURNING *
        `;
    }

}