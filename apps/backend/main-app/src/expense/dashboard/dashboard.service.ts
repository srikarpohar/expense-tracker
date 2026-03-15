import { BadRequestException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { AddExpenseRequestDto, ExpenseLogActions, ExpenseType, GetCalendarDataResponse, getCurrencyFromCode, IExpense, IExpenseHistory, IUserPayload, IUserTransaction } from "expense-tracker-shared";
import { PgDatabaseConnectionService } from "src/shared/database/db.connection";
import { ExpenseHistoryService } from "../expense-history.service";
import { ExpenseCategoryService } from "../expense-category/expense-category.service";
import { UserTransactionsService } from "src/users/user-transactions/user-transactions.service";

export class DashboardService {

    constructor(
        private dbConnection: PgDatabaseConnectionService,
        private expenseHistoryService: ExpenseHistoryService,
        private expenseCategoryService: ExpenseCategoryService,
        private userTransactionsService: UserTransactionsService
    ) {}

    async getCalendarData(user_id: number, monthYear: string) {
        console.log(user_id, monthYear);
        const [month, year] = monthYear.split("/").map(doc => Number(doc));

        const result: {
            created_at: Date, 
            grouped_result: {
                currency: string, 
                total_amount: number, 
                created_at: Date
            }[]
        }[] = await this.dbConnection.sqlInstance`
            WITH currency_grouping AS (
              SELECT created_at, currency, SUM(amount) total_amount FROM expense 
              WHERE user_id = ${user_id}
              AND created_at BETWEEN ${this.dbConnection.sqlInstance(`${year}-${month}-01`)} AND ${this.dbConnection.sqlInstance(`${year}-${month}-31`)}
              GROUP BY created_at, currency
            )
            SELECT created_at, ARRAY_AGG(currency_grouping) grouped_result
            FROM currency_grouping
            GROUP BY created_at
            ORDER BY created_at;
        `;
        // SELECT created_at, currency, SUM(amount) total_amount FROM expense WHERE user_id = ${user_id} 
        //     AND created_at BETWEEN ${this.dbConnection.sqlInstance(`${year}-${month}-01`)} 
        //     AND ${this.dbConnection.sqlInstance(`${year}-${month}-31`)} 

        // const finalResult: {[key: string]: GetCalendarDataResponse} = {};
        const finalResult: GetCalendarDataResponse[] = [];
        for(const row of result) {
            const date = `${row.created_at.getDate()}/${row.created_at.getMonth()}/${row.created_at.getFullYear()}`;
            finalResult.push({
                date: date,
                currencyData: row.grouped_result.map(doc => ({
                    currency: doc.currency,
                    totalAmount: doc.total_amount
                }))
            })

            // const currencyIndex = finalResult[date].currencyData.findIndex(doc => doc.currency == row.currency);
            // if(currencyIndex == -1) {
            //     finalResult[date].currencyData.push({
            //         currency: row.currency,
            //         totalAmount: row.total_amount
            //     })
            // } else {
            //     finalResult[date].currencyData[currencyIndex].totalAmount += row.total_amount;
            // }
        }

        return Object.values(finalResult);
    }

    async addExpense(data: AddExpenseRequestDto, user: IUserPayload): Promise<IExpense> {
        // Validate currency.
        const currency = getCurrencyFromCode(data.currency);
        if(!currency) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                data: null,
                errorMessage: "Currency is invalid!"
            })
        }

        let expense;
        try {
            // Check and create category if required.
            if(!data.category_id) {
                const expenseCategoryId = await this.expenseCategoryService.createCategoryIfNotPresent(data.category_name, data.category_description);
                data["category_id"] = expenseCategoryId;
            }
            //Create expense.
            const expenseDoc: IExpense = {
                category_id: data.category_id,
                user_id: user.sub,
                amount: data.amount,
                currency: currency.currency,
                name: data.name,
                type: data.type,
                notes: data.notes,
                created_at: data.date ? data.date : new Date()
            }
    
            expense = await this.dbConnection.sqlInstance`
                INSERT INTO expense
                ${this.dbConnection.sqlInstance(expenseDoc, ["amount", "category_id", "user_id", "currency", "name", "notes"])}
                RETURNING *
            `;
            // Add log of expense in history table.
            await this.expenseHistoryService.logExpenseAction(
                {
                    action: ExpenseLogActions.CREATED,
                    expense_id: expense.at(0).id
                },
                user
            );
            // Add log of expense in user transactions table.
            const userTransactionDoc: IUserTransaction = {
                expense_id: expense.expense_id,
                user_id: user.sub,
                is_recurring_expense: !!expenseDoc.recurring_frequency,
                transaction_type: ExpenseType.DEBIT,
                amount: expenseDoc.amount
            }
            await this.userTransactionsService.createUserTransaction(userTransactionDoc);
        } catch(error: any) {
            console.log(`Error while creating expense: ${error}`);
            throw new InternalServerErrorException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                data: null,
                errorMessage: ""
            })
        } finally {
            if(expense) {
                const log: Pick<IExpenseHistory, "expense_id" | "action"> = {
                    expense_id: (expense.at(0) as IExpense).expense_id as number,
                    action: ExpenseLogActions.CREATED
                }
                await this.expenseHistoryService.logExpenseAction(log, user);
            }
        }

        // Logic to add expense would go here
        return expense.at(0) as IExpense;
    }
}