import { IUser } from "../../auth/models";
import { RecurringExpenseFrequency } from "../../enums";

export interface IExpenseCategory {
    expense_cat_id?: number;
    name: string;
    thumbnail_url?: string;
    description: string;
}

export interface IExpense {
    expense_id?: number;
    name: string;
    category_id: number | IExpenseCategory;
    description: string;
    amount: number;
    currency: string;
    created_on: Date;
    paid_on?: Date;
    created_by: number | IUser;
    recurring_frequency?: RecurringExpenseFrequency;
    bill_image_url?: string;
    deleted_at?: Date;
}