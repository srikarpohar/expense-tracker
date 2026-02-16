import { IUser } from "../../auth/models";
import { ExpenseType, RecurringExpenseFrequency } from "../../enums";
import { IExpenseCategory } from "./expense-catgeory.model";

export interface IExpense {
    expense_id?: number;
    user_id: number | IUser;
    name: string;
    category_id: number | IExpenseCategory;
    notes: string;
    amount: number;
    currency: string;
    type: ExpenseType;
    created_at?: Date;
    paid_on?: Date;
    recurring_frequency?: RecurringExpenseFrequency;
    bill_image_url?: string;
    deleted_at?: Date;
}