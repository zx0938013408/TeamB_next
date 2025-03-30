
export const API_SERVER = `http://localhost:3001`;


// 頭貼的路
export const AVATAR_PATH = `${API_SERVER}/imgs/`;


// 取得通訊錄列表的資料 GET
export const AL_LIST = `${API_SERVER}/activity-list/api`;

// 通訊錄: 取得單一項目資料
// `${API_SERVER}/activity-list/api/${ab_id}`
export const AL_ITEM_GET = `${API_SERVER}/activity-list/api`;


// 通訊錄: 新增資料 POST
// export const AL_ADD_POST = `${API_SERVER}/activity-list/api`;
export const AL_CREATE_POST = `${API_SERVER}/activity-create/api`;

// 通訊錄: 刪除項目 DELETE
// `${API_SERVER}/activity-list/api/${ab_id}`
export const AL_DELETE = `${API_SERVER}/activity-list/api`;

// 通訊錄: 修改項目 PUT
// `${API_SERVER}/activity-list/api/${ab_id}`
export const AL_ITEM_PUT = `${API_SERVER}/activity-list/api`;

// 取得某會員的已報名活動列表
export const MEMBER_ACTIVITIES = (memberId) => `${API_SERVER}/members/${memberId}/activities`;
// 取得某會員的已創立活動列表
export const MEMBER_CREATED_ACTIVITIES = (memberId) => `${API_SERVER}/members/${memberId}/created-activities`;
// 取得某會員的已報名活動列表
export const MEMBER_FAVORITES = (memberId) => `${API_SERVER}/members/${memberId}/favorites`;

// 會員修改活動詳情
export const MEMBER_UPDATE_ACTIVITY = (alId) => `${API_SERVER}/members/${alId}`;

// 會員刪除活動
export const MEMBER_DELETE_ACTIVITY = (alId) => `${API_SERVER}/members/${alId}`;

// 活動留言板
export const MESSAGE_BOARD_GET = (activityId) => `${API_SERVER}/api/messages/activity-board/${activityId}`;
export const MESSAGE_BOARD_POST = `${API_SERVER}/api/messages/activity-board`;


// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;

// Toggle like
export const TOGGLE_LIKE = `${API_SERVER}/activity-list/api/favorite`;