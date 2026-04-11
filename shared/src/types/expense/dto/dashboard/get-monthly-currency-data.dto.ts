export interface GetMonthlyCurrencyDataRequest {
    startDate: string;
    endDate: string;
}

export interface GetMonthlyCurrencyDataResponse {
    country_code: string;
    total_amount: number;
    total_expenses_count: number;
}