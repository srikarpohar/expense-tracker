export interface GetMonthlyCurrencyDataRequest {
    startDate: string;
    endDate: string;
}

export interface GetMonthlyCurrencyDataResponse {
    country_code: string;
    total_amount: string;
    total_expenses_count: string;
}