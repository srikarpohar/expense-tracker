export enum UserVerificationStatus {
    OTP_SENT = "OTP_SENT",
    OTP_VERIFIED = "OTP_VERIFIED",
    OTP_EXPIRED = "OTP_EXPIRED",
    OTP_RESENT = "OTP_RESENT",
    FAILED = "FAILED"
}

export enum ExpenseType {
    CREDIT = "Credit",
    DEBIT = "Debit"
}

export enum ExpenseLogActions {
    CREATED = "CREATED",
    AMOUNT_UPDATED = "AMOUNT_UPDATED",
    CURRENCY_UPDATED = "CURRENCY_UPDATED",
    TYPE_UPDATED = "TYPE_UPDATED",
    ITEMS_LIST_UPDATED = "ITEMS_LIST_UPDATED",
    PAID = "PAID",
    DELETED = "DELETED"
}

export enum RecurringExpenseFrequency {
    DAY = "day",
    MONTH = "month",
    WEEK = "week",
    YEAR = "year"
}