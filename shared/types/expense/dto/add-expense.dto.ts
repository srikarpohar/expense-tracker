import { IExpense } from "../models/expense.model";

export type AddExpenseRequestDto = Omit<IExpense, "expense_id" | "created_on" | "paid_on" | "created_by" | "deleted_at">

export interface AddExpenseResponseDTO {
    expense_id: number;
}