import ApiOrderService from "./client/ApiOrderService";

export const fetchMenuOrder = () => {
  return ApiOrderService.get("/order/menu/get-list");
};

export const fetchTableCategory = (id) => {
  return ApiOrderService.get(`/admin/order/tables/${id}`);
};

export const getMenuByCategory = (id) => {
  return ApiOrderService.get(`/order/menu/get-by-category/${id}`);
};

export const createOrder = (slug, data) => {
  return ApiOrderService.post(`/order/${slug}`, data);
};
export const getQR = (tableId) => {
  return ApiOrderService.get(`/admin/create-qr?table=${tableId}`);
};

export const getTableByArea = (areaId) => {
  return ApiOrderService.get(`/admin/order/tables/${areaId}`);
};

export const viewDetailOrder = (id) => {
  return ApiOrderService.get(`/order/view-order/${id}`);
};

export const closeTable = (tableId, body) => {
  return ApiOrderService.post(`/admin/order/close/${tableId}`, body);
};

export const printBill = (tableId) => {
  return ApiOrderService.get(`/order/print-bill/${tableId}`);
};

export const moveTable = (from, to) => {
  return ApiOrderService.get(`/admin/order/move-table?from=${from}&to=${to}`);
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

export const getMenuBySearch = (search) => {
  return ApiOrderService.get(`/order/menu/search?keyword=${search}`);
};
