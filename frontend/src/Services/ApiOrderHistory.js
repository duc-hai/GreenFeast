import ApiOrderService from "./client/ApiOrderService";

export const getHistoryList = () => {
  return ApiOrderService.get(`order/online/history-list`);
};

export const getHistoryDetail = (id) => {
  return ApiOrderService.get(`/order/online/history-detail/${id}`);
};
