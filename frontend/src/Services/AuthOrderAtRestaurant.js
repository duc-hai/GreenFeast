import ApiOrderService from "./client/ApiOrderService";

export const getOrderAtRestaurant = (token) => {
  return ApiOrderService.get(`/order/verify-slug/${token}`);
};
