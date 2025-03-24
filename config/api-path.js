
export const API_SERVER = `http://localhost:3001`;

// 照片的路
export const AVATAR_PATH = `${API_SERVER}/imgs`;

// 取得通訊錄列表的資料 GET
export const AL_LIST = `${API_SERVER}/activity-list/api`;

// 通訊錄: 取得單一項目資料
// `${API_SERVER}/activity-list/api/${ab_id}`
export const AL_ITEM_GET = `${API_SERVER}/activity-list/api`;


// 通訊錄: 新增資料 POST
export const AL_ADD_POST = `${API_SERVER}/activity-list/api`;

// 通訊錄: 刪除項目 DELETE
// `${API_SERVER}/activity-list/api/${ab_id}`
export const AL_DELETE = `${API_SERVER}/activity-list/api`;

// 通訊錄: 修改項目 PUT
// `${API_SERVER}/activity-list/api/${ab_id}`
export const AL_ITEM_PUT = `${API_SERVER}/activity-list/api`;

// 取得某會員的活動列表
export const MEMBER_ACTIVITIES = (memberId) => `${API_SERVER}/members/${memberId}/activities`;


// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;

// Toggle like
export const TOGGLE_LIKE = `${API_SERVER}/activity-list/api/favorite`;