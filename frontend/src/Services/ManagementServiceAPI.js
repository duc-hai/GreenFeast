import ApiManagementService from "./client/ApiManagementService";

export const createCategory = (body) => {
  return ApiManagementService.post("/category/create", body);
};

export const getCategory = () => {
  return ApiManagementService.get("/category/get-all");
};
export const updateCategory = (id, body) => {
  return ApiManagementService.put(`/category/update/${id}`, body);
};
export const deleteCategory = (id) => {
  return ApiManagementService.delete(`/category/delete/${id}`);
};

export const createArea = (body) => {
  return ApiManagementService.post("/area/create", body);
};

export const getAllArea = () => {
  return ApiManagementService.get("/area/get-all");
};

export const updateArea = (id, body) => {
  return ApiManagementService.put(`/area/update/${id}`, body);
};

export const deleteArea = (id) => {
  return ApiManagementService.delete(`/area/delete/${id}`);
};

export const createTable = (body) => {
  return ApiManagementService.post("/table/create", body);
};

export const getTable = (id) => {
  return ApiManagementService.get(`/table/get-tables?area_id=${id}`);
};

export const deleteTable = (body) => {
  return ApiManagementService.delete(`/table/delete`, { data: body });
};

export const createPromotion = (body) => {
  return ApiManagementService.post("/promotion/create", body);
};

export const fetchFormPromotion = (id) => {
  return ApiManagementService.get(`/promotion/get-form-promotion`);
};

export const getPromotion = () => {
  return ApiManagementService.get("/promotion/get-all");
};

export const updatePromotion = (id, body) => {
  return ApiManagementService.put(`/promotion/update/${id}`, body);
};

export const deletePromotion = (id) => {
  return ApiManagementService.delete(`/promotion/delete/${id}`);
};

export const createMenu = (body) => {
  return ApiManagementService.post("/menu/create", body);
};

export const getMenu = () => {
  return ApiManagementService.get("/menu/get-all");
};

export const updateMenu = (id, body) => {
  return ApiManagementService.put(`/menu/update/${id}`, body);
};

export const deleteMn = (id) => {
  return ApiManagementService.delete(`/menu/delete/${id}`);
};

export const getTypePrint = () => {
  return ApiManagementService.get("/printer/get-printer-type");
};

export const createPrinter = (body) => {
  return ApiManagementService.post("/printer/create", body);
};

export const updatePrint = (id, body) => {
  return ApiManagementService.put(`/printer/update/${id}`, body);
};

export const getPrint = () => {
  return ApiManagementService.get("/printer/get-all");
};

export const deletePrint = (id) => {
  return ApiManagementService.delete(`/printer/delete/${id}`);
};
