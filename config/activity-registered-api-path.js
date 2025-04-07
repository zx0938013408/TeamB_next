
export const API_SERVER = `http://localhost:3001`;
// export const API_SERVER = `http://172.23.53.146:3001`;

// 頭貼的路
export const AVATAR_PATH = `${API_SERVER}/registered/api`;

// 取得所有報名資料 GET
export const ACTIVITY_LIST = `${API_SERVER}/registered/api`;

// 取得單筆報名資料
// `${API_SERVER}/address-book/api/${ab_id}`
export const ACTIVITY_ITEM_GET = `${API_SERVER}/registered/api`;

// 取得特定活動的會員報名資料
// export const ACTIVITY_CHECK_GET = (activity_id, member_id) => `${API_SERVER}/registered/check?activity_id=${activity_id}&member_id=${member_id}`;



// 新增報名 POST
export const ACTIVITY_ADD_POST = `${API_SERVER}/registered/api`;

// 刪除報名 DELETE
// `${API_SERVER}/address-book/api/${ab_id}`
//export const ACTIVITY_DELETE = `${API_SERVER}/registered/api`;
export const ACTIVITY_REGISTRATION_DELETE = (id) => `${API_SERVER}/registered/${id}`;

// 修改報名 PUT
// `${API_SERVER}/address-book/api/${ab_id}`
export const ACTIVITY_ITEM_PUT = (id) => `${API_SERVER}/registered/api/${id}`;



// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;
