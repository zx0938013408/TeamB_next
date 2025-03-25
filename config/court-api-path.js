
export const API_SERVER = `http://localhost:3001`;
// export const API_SERVER = `http://172.23.53.146:3001`;


// 取得縣市的資料 GET
export const COURT_LIST = `${API_SERVER}/court/api`;

// 縣市: 取得單一項目資料
// `${API_SERVER}/activity-list/api/${ab_id}`
export const COURT_ITEM_GET = `${API_SERVER}/court/api`;


// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;

// Toggle like
//`${API_SERVER}/activity-list/toggle-like/${ab_id}`
//export const TOGGLE_LIKE = `${API_SERVER}/activity-list/toggle-like`;
