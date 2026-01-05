import { ExpenseLogActions, IExpenseHistory, IUserPayload } from "expense-tracker-shared";
import { PgDatabaseConnectionService } from "src/shared/database/db.connection";

export class ExpenseHistoryService {
    constructor(
        private readonly dbConnection: PgDatabaseConnectionService
    ) {}

    async logExpenseAction(log: Pick<IExpenseHistory, "action" | "expense_id">, user: IUserPayload) {
        const expenseHistoryDoc: IExpenseHistory = {
            expense_id: log.expense_id as number,
            action: log.action as ExpenseLogActions,
            action_done_on: new Date(),
            action_done_by: user.sub
        }

        const result = await this.dbConnection.sqlInstance`
            INSERT INTO expense_history
            ${this.dbConnection.sqlInstance(expenseHistoryDoc, ["expense_id", "action", "action_done_by", "action_done_on"])}
            RETURNING log_id;
        `;

        return result.at(0);
    }
}