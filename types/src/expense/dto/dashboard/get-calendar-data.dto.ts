export interface GetCalendarDataRequest {
    startDate: string;
    endDate: string;
}

export interface GetCalendarDataResponse {
    expense_date: string;
    category_data: {
        category: string,
        country_totals: string;
    }[];
}