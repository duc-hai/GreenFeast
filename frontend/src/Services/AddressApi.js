import ApiOrderService from "./client/ApiOrderService";

export const getListProvince = () => {
  return ApiOrderService.get(`order/online/provinces`);
};

export const getListDistrict = (id) => {
  return ApiOrderService.get(`order/online/districts/${id}`);
};

export const getListWard = (id) => {
  return ApiOrderService.get(`order/online/wards/${id}`);
};

export const postShipFee = (data) => {
  return ApiOrderService.post(`order/online/shipping-fee`, data);
};
