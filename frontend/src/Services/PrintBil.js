import ApiPrintBill from "./client/ApiPrintBill";

export const getPrintBillKitchen = (page) => {
  return ApiPrintBill.get(`order/processing-ticket/kitchen?page=${page}`);
};

export const getPrintBillBar = (page) => {
  return ApiPrintBill.get(`order/processing-ticket/bar?page=${page}`);
};
