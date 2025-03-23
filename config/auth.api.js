// 伺服器網址
export const API_SERVER = "http://localhost:3001";

// 頭貼的路
export const AVATAR_PATH = `${API_SERVER}`;

export const MB_LIST_DET= `${API_SERVER}/members/api`;


export const AUTH_GET= `${API_SERVER}/auth`;

// 取得所有縣市
export const MB_CITY_GET= `${AUTH_GET}/city/api`;

//獲取某個縣市的地區
export const MB_AREA_GET= `${AUTH_GET}/api/areas`;


//取得會員資料
export const MB_MEMBER_GET= `${AUTH_GET}/members/api`;


//獲得單筆會員資料
export const MB_MEMBER_ID_GET= `${AUTH_GET}/members/api/:id`;

//修改單筆會員資料
export const MB_MEMBER_NEW_PUT= `${AUTH_GET}//members/api/:id`;



//處理照片上傳
export const  MB_AVATAR_POST =`${AUTH_GET}/avatar/api`


//註冊
export const MB_REGISTER_GET =`${AUTH_GET}/api/register`;


//登出
export const MB_LOGOUT_GET =`${AUTH_GET}/logout`;


//檢查密碼
export const MB_CHECK_GET=`${AUTH_GET}/api/check-email`;


//檢查email有沒有註冊
export const MB_EMAIL_POST=`${AUTH_GET}/api/check-email`;


//登入
export const MB_LOGIN_POST =`${AUTH_GET}/login-jwt`;




// 修改會員資料 API
export const MB_EDIT_PUT =`${AUTH_GET}/user-edit`;


// 處理密碼重設請求
// export const MB_RESET_POST =`${API_SERVER}/reset-password`;
