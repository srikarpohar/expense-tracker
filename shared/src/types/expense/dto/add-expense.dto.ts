import { ExpenseType, RecurringExpenseFrequency } from "../../enums";

export type AddExpenseRequestDto = {
    name: string,
    category_id: number,
    notes: string,
    amount: number,
    currency: string,
    type: ExpenseType,
    recurring_frequency?: RecurringExpenseFrequency,
    bill_image?: File
}

export interface AddExpenseResponseDTO {
    expense_id: number;
}