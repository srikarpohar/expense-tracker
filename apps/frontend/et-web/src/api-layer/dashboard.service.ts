/* eslint-disable prettier/prettier */
import type {
  GetCalendarDataRequest,
  GetCalendarDataResponse,
  GetMonthlyCurrencyDataRequest,
  GetMonthlyCurrencyDataResponse,
} from "../../../../../types/src";
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

export const fetchCalendarData = (
  startDate: string,
  endDate: string
): Promise<GetCalendarDataResponse[]> => {
  return axiosHttpApiRequestLayer.get<GetCalendarDataRequest, GetCalendarDataResponse[]>("/dashboard/calendar", {
    startDate,
    endDate
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    console.log(error);
    return [];
  });
};
