import { IUser } from "../../auth/models";
import { ExpenseLogActions } from "../../enums";
import { IExpense } from "./expense.model";

export interface IExpenseHistory {
    log_id?: number;
    expense_id: number | IExpense;
    action: ExpenseLogActions;
    action_done_on: Date;
    action_done_by: number | IUser;
}
