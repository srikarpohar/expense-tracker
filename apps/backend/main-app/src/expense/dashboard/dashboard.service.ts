import { BadRequestException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { AddExpenseRequestDto, ExpenseLogActions, getCurrencyFromCode, IExpense, IExpenseHistory, IUserPayload } from "expense-tracker-shared";
import { PgDatabaseConnectionService } from "src/shared/database/db.connection";
import { ExpenseHistoryService } from "../expense-history.service";

export class DashboardService {

    constructor(
        private dbConnection: PgDatabaseConnectionService,
        private expenseHistoryService: ExpenseHistoryService
    ) {}

    getCalendarData(user: number, monthYear: string) {
        console.log(user, monthYear);

        return { message: "Welcome to the Expense Dashboard!" };
    }

    async addExpense(data: AddExpenseRequestDto, user: IUserPayload): Promise<IExpense> {
        // Validate currency.
        const currency = await getCurrencyFromCode(data.currency);
        if(!currency) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                data: null,
                errorMessage: "Currency is invalid!"
            })
        }

        let expense;
        try {
            //Create expense.
            const expenseDoc: IExpense = {
                category_id: data.category_id,
                user_id: user.sub,
                amount: data.amount,
                currency: currency.currency,
                name: data.name,
                type: data.type,
                notes: data.notes
            }
    
            expense = await this.dbConnection.sqlInstance`
                INSERT INTO expense
                ${this.dbConnection.sqlInstance(expenseDoc, ["amount", "category_id", "user_id", "currency", "name", "notes"])}
                RETURNING *
            `;
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