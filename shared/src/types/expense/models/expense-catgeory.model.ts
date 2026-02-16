import { IAttachment } from "../../common";

export interface IExpenseCategory {
    id?: number,
    name: string,
    description: string,
    thumbnail_id?: number | IAttachment;
}