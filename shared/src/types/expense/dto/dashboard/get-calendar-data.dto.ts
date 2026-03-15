export interface GetCalendarDataRequest {
    monthYear: string;
}

export interface GetCalendarDataResponse {
    date: string;
    currencyData: {
        totalAmount: number;
        currency: string;
    }[]
}