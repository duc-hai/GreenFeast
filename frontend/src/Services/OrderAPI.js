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
