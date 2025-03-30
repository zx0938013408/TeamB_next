// 設定 API 基本路徑
export const API_SERVER = `http://localhost:3001`; 
// export const API_SERVER = `http://172.23.53.146:3001`; // 用於部署環境（如果有）

// 頭貼的路
export const AVATAR_PATH = `${API_SERVER}/imgs/`;

// 取得所有訂單 GET
export const ORDER_LIST = `${API_SERVER}/orders/api`; // 路徑中增加 /api

// 取得單筆訂單 GET
export const ORDER_ITEM_GET = `${API_SERVER}/orders/api`; // 動態路徑

// 新增訂單 POST
export const ORDER_ADD_POST = `${API_SERVER}/orders/api`; // 路徑中增加 /api

// 刪除訂單 DELETE
export const ORDER_DELETE = `${API_SERVER}/orders/api`;

// 取消訂單 PUT
export const ORDER_ITEM_PUT = `${API_SERVER}/orders/api/cancel`;

// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;