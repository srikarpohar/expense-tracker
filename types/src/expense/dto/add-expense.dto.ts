import { ExpenseType, RecurringExpenseFrequency } from "../../enums";

export type AddExpenseRequestDto = {
    name: string,
    category_name: string,
    category_description: string,
    category_id?: number,
    notes: string,
    amount: number,
    currency: string,
    type: ExpenseType,
    recurring_frequency?: RecurringExpenseFrequency,
    bill_image?: File;
    date?: Date;
}

export interface AddExpenseResponseDTO {
    expense_id: number;
}