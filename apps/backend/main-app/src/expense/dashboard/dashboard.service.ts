import { BadRequestException, HttpStatus, Inject, InternalServerErrorException } from "@nestjs/common";
import { AddExpenseRequestDto, ExpenseLogActions, ExpenseType, GetCalendarDataResponse, getCountryCodeFromCurrency, IExpense, IExpenseHistory, IUserPayload, IUserTransaction } from "expense-tracker-shared";
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

    // async getMonthlyCurrencyData(user_id: number, monthYear: string) {
    //     const [month, year] = monthYear.split("/").map(doc => Number(doc));
    //     const monthQueryString = month.toString().padStart(2, "0");

    //     const result: {
    //         created_at: Date, 
    //         currency: string,
    //         total_amount: number
    //     }[] = await this.dbConnection.sqlInstance`
    //         SELECT created_at, currency, SUM(amount) total_amount FROM expense 
    //         WHERE user_id = ${user_id} 
    //         AND created_at BETWEEN ${`${year}-${monthQueryString}-01`} 
    //         AND ${`${year}-${monthQueryString}-31`} 
    //         GROUP BY created_at, currency
    //         ORDER BY created_at, currency;
    //     `;

    //     const finalResult: GetCalendarDataResponse[] = [];
    //     let currencyData: {
    //         totalAmount: number;
    //         currency: string;
    //     }[] = [], prevCreatedAt: string = "";
    //     for(const row of result) {
    //         const date = `${row.created_at.getDate()}/${row.created_at.getMonth()}/${row.created_at.getFullYear()}`;
    //         if(prevCreatedAt != date && prevCreatedAt != "") {
    //             finalResult.push({
    //                 date: date,
    //                 currencyData: currencyData,
    //             })
    //             currencyData = [];
    //         }

    //         currencyData.push({
    //             currency: row.currency,
    //             totalAmount: row.total_amount
    //         })
    //         prevCreatedAt = date;
    //     }

    //     if(result.length) {
    //         finalResult.push({
    //             date: prevCreatedAt,
    //             currencyData: currencyData,
    //         })
    //     }
    //     return finalResult;
    // }

    async addExpense(data: AddExpenseRequestDto, user: IUserPayload): Promise<IExpense> {
        // Validate currency.
        const countryCode = getCountryCodeFromCurrency(data.currency);
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