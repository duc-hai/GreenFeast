import StatisticService from "./client/StatisticService";

export const getStatisticRevenue = (from, to) => {
  return StatisticService.get(`statistics/get-revenue?from=${from}&to=${to}`);
};

export const getStatisticMenu = (from, to) => {
  return StatisticService.get(`statistics/menu?from=${from}&to=${to}`);
};
export const getStatisticCustomer = (from, to) => {
  return StatisticService.get(`statistics/num-customer?from=${from}&to=${to}`);
};

export const getStatisticArea = (from, to) => {
  return StatisticService.get(`statistics/area?from=${from}&to=${to}`);
};
