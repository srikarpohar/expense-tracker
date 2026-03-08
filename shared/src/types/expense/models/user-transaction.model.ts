import { ExpenseType } from "../../enums";

export interface IUserTransaction {
    user_expense_id?: number;
    user_id: number;
    expense_id: number;
    is_recurring_expense: boolean;
    transaction_type: ExpenseType;
    amount: number;
}