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

export const getPromotion = () => {
  return ApiManagementService.get("/promotion/get-all");
};

export const updatePromotion = (id, body) => {
  return ApiManagementService.put(`/promotion/update/${id}`, body);
};

export const deletePromotion = (id) => {
  return ApiManagementService.delete(`/promotion/delete/${id}`);
};
