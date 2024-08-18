import ApiOrderService from "./client/ApiOrderService";

export const fetchMenuOrder = () => {
  return ApiOrderService.get("/order/menu/get-list");
};

export const fetchTableCategory = (id) => {
  return ApiOrderService.get(`/admin/order/tables/${id}`);
};

export const getReturnPayment = (url) => {
  return ApiOrderService.get(`payment/vnpay_return${url}`);
};
export const getMenuByCategory = (id) => {
  return ApiOrderService.get(`/order/menu/get-by-category/${id}`);
};

export const getMenuRecommend = () => {
  return ApiOrderService.get(`/recommend/menu`);
};

export const getMenuList = (page, size) => {
  return ApiOrderService.get(
    `/order/menu/get-list?page=${page}&perPage=${size}`
  );
};
export const postOrderRating = (data) => {
  return ApiOrderService.post(`order/rating`, data);
};

export const createOrder = (slug, data) => {
  return ApiOrderService.post(`/order/${slug}`, data);
};

export const createOrderOnline = (data) => {
  return ApiOrderService.post(`/order/online`, data);
};

export const getQR = (tableId) => {
  return ApiOrderService.get(`admin/order/create-qr?table=${tableId}`);
};

export const getTableByArea = (areaId) => {
  return ApiOrderService.get(`/admin/order/tables/${areaId}`);
};
export const getTableAll = (id) => {
  return ApiOrderService.get(`/admin/table/get-tables?area_id=${id}`);
};

export const viewDetailOrder = (id) => {
  return ApiOrderService.get(`/order/view-order/${id}`);
};

export const postPayment = (data) => {
  return ApiOrderService.post(`payment/create-payment-url`, data);
};

export const closeTable = (tableId, body) => {
  return ApiOrderService.post(`/admin/order/close/${tableId}`, body);
};

export const getOrderHistoryListAtRestaurant = () => {
  return ApiOrderService.get(`/order/history-list`);
};
export const getOrderHistoryDetailAtRestaurant = (id) => {
  return ApiOrderService.get(`/order/history-detail/${id}`);
};

export const getOrderHistoryListAdmin = (param) => {
  return ApiOrderService.get(`admin/order/online/history-list?${param}`);
};

export const postUpdateStatus = (data) => {
  return ApiOrderService.post(`admin/order/online/update-status`, data);
};

export const postSendTMS = (data) => {
  return ApiOrderService.post(`tms/resend-order`, data);
};
export const getOrderHistoryDetailAdmin = (id) => {
  return ApiOrderService.get(`/admin/order/online/history/${id}`);
};

export const getPromotion = () => {
  return ApiOrderService.get(`/order/promotion`);
};

export const printBill = (tableId) => {
  return ApiOrderService.get(`/order/print-bill/${tableId}`);
};

export const moveTable = (from, to) => {
  return ApiOrderService.get(`/admin/order/move-table?from=${from}&to=${to}`);
};

export const getAllAreaOrder = () => {
  return ApiOrderService.get("/order/area/get-all");
};

export const getRevenus = (start, to) => {
  return ApiOrderService.get(
    `${
      start
        ? `/admin/order/get-revenue?from=${start}&to=${to}`
        : "/admin/order/get-revenue"
    } `
  );
};

export const getStatisticsQueryReturn = (date) => {
  return ApiOrderService.get(`statistics/query-return?date=${date}`);
};
export const getMenuBySearch = (search) => {
  return ApiOrderService.get(`/order/menu/search?keyword=${search}`);
};

export const getCategoryOrder = () => {
  return ApiOrderService.get("/order/category/get-all");
};

export const getHistoryOrder = () => {
  return ApiOrderService.get(`/admin/order/history`);
};

export const getBillHistory = (id) => {
  return ApiOrderService.get(`/admin/order/history/print-bill?order=${id}`);
};

export const applyPromotion = (body) => {
  return ApiOrderService.post(`/order/apply-promotion`, body);
};
