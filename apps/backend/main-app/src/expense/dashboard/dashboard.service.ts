import { BadRequestException, HttpStatus, Inject, InternalServerErrorException } from "@nestjs/common";
import { AddExpenseRequestDto, ExpenseLogActions, ExpenseType, getCountryCodeFromCurrencySymbol, IExpense, IExpenseHistory, IUserPayload, IUserTransaction } from "expense-tracker-shared";
import { ExpenseHistoryService } from "../expense-history.service";
import { ExpenseCategoryService } from "../expense-category/expense-category.service";
import { UserTransactionsService } from "src/users/user-transactions/user-transactions.service";
import { ExpenseRepository } from "../expense.repository";

export class DashboardService {
    @Inject()
    private readonly expenseCategoryService!: ExpenseCategoryService;
    @Inject()
    private readonly expenseHistoryService!: ExpenseHistoryService;
    @Inject()
    private readonly userTransactionsService!: UserTransactionsService;

    @Inject()
    private readonly expenseRepositoryService!: ExpenseRepository;


    constructor() {}

    async getMonthlyCurrencyData(
        user_id: number, 
        startDate: string, 
        endDate: string
    ) {
        return this.expenseRepositoryService.getMonthlyExpensesByCurrencyInaDateRange(
            user_id,
            new Date(startDate),
            new Date(endDate)
        )
    }

    async getCalendarData(user_id: number, startDate: string, endDate: string) {
        const calendarData = await this.expenseRepositoryService.getDailyExpensesByCategoryAndCurrencyInaDateRange(
            user_id,
            new Date(startDate),
            new Date(endDate)
        );

        return calendarData;
    }

    async addExpense(data: AddExpenseRequestDto, user: IUserPayload): Promise<IExpense> {
        // Validate currency.
        const countryCode = getCountryCodeFromCurrencySymbol(data.currency);
        if(!countryCode) {
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
                country_code: countryCode,
                name: data.name,
                type: data.type || ExpenseType.DEBIT,
                notes: data.notes,
                created_at: data.date ? data.date : new Date()
            }
    
            expense = await this.expenseRepositoryService.createExpenseDoc(expenseDoc);

            const userTransactionDoc: IUserTransaction = {
                expense_id: expense.at(0).expense_id,
                user_id: user.sub,
                is_recurring_expense: !!expenseDoc.recurring_frequency,
                transaction_type: ExpenseType.DEBIT,
                amount: expenseDoc.amount
            }
            await this.userTransactionsService.createUserTransaction(userTransactionDoc);
        } catch(error: any) {
            console.log(`Error while creating expense: ${error.message}`);
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