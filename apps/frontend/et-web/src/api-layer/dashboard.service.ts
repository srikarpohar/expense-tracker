/* eslint-disable prettier/prettier */
import type {
  GetMonthlyCurrencyDataRequest,
  GetMonthlyCurrencyDataResponse,
} from "expense-tracker-shared";
import { axiosHttpApiRequestLayer } from "./base.service";

export const fetchCurrencyDashboardData = (
  startDate: string,
  endDate: string,
): Promise<GetMonthlyCurrencyDataResponse[]> => {
  return axiosHttpApiRequestLayer.get<
    GetMonthlyCurrencyDataRequest,
    GetMonthlyCurrencyDataResponse[]
  >("/dashboard/currency", {
    startDate,
    endDate,
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    console.log(error);
    return [];
  });
};
