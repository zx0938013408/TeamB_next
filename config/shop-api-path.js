
export const API_SERVER = `http://localhost:3001`;
// export const API_SERVER = `http://172.23.53.146:3001`;

// 商品圖的路
export const AVATAR_PATH = `${API_SERVER}/imgs/`;

// 取得通訊錄列表的資料 GET
export const AB_LIST = `${API_SERVER}/products/api`;

// 通訊錄: 取得單一項目資料
// `${API_SERVER}/address-book/api/${ab_id}`
export const AB_ITEM_GET = `${API_SERVER}/products/api`;


// 通訊錄: 新增資料 POST
export const AB_ADD_POST = `${API_SERVER}/products/api`;

// 通訊錄: 刪除項目 DELETE
// `${API_SERVER}/address-book/api/${ab_id}`
export const AB_DELETE = `${API_SERVER}/products/api`;

// 通訊錄: 修改項目 PUT
// `${API_SERVER}/address-book/api/${ab_id}`
export const AB_ITEM_PUT = `${API_SERVER}/products/api`;



// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;

// Toggle like
// `${API_SERVER}/address-book/toggle-like/${ab_id}`
export const TOGGLE_LIKE = `${API_SERVER}/products/api/pd_likes`;