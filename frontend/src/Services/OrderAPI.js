import ApiOrderService from "./client/ApiOrderService";

export const fetchMenuOrder = () => {
  return ApiOrderService.get("/order/menu/get-list");
};

export const getMenuByCategory = (id) => {
  return ApiOrderService.get(`/order/menu/get-by-category/${id}`);
};
