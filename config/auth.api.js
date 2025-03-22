// 伺服器網址
export const API_SERVER = "http://localhost:3001";

// 頭貼的路
export const AVATAR_PATH = `${API_SERVER}/imgs`;


// 取得會員的資料 GET
export const MB_LIST_DET= `${API_SERVER}/members/api`;

//註冊
export const MB_REGISTER_GET =`${API_SERVER}/api/register`;


//登出
export const MB_LOGOUT_GET =`${API_SERVER}/logout`;

//檢查密碼
export const MB_CHECK_GET=`${API_SERVER}/api/check-email`;

//登入
export const MB_LOGIN_POST =`${API_SERVER}/login-jwt`;

// //會員資料
export const MB_PROFILE_GET =`${API_SERVER}/api-profile`;


// 修改會員資料 API
export const MB_EDIT_PUT =`${API_SERVER}/user-edit`;


// 處理密碼重設請求
// export const MB_RESET_POST =`${API_SERVER}/reset-password`;
