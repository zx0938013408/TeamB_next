// 設定 API 基本路徑
export const API_SERVER = `http://localhost:3001`; 
// export const API_SERVER = `http://172.23.53.146:3001`; // 用於部署環境（如果有）


// 頭貼的路
export const AVATAR_PATH = `${API_SERVER}/imgs/`;

// 優惠券的 API 路徑
export const COUPON_LIST = `${API_SERVER}/coupons/api`; // 取得所有優惠券

export const SCRATCH_COUPON = `${API_SERVER}/coupons/api/scratch`; // 會員刮刮卡 - 獲得隨機優惠券

export const MY_COUPONS = `${API_SERVER}/coupons/api`; // 取得會員的所有優惠券（需要提供 userId）

export const USE_COUPON = `${API_SERVER}/coupons/api/use-coupon`; // 訂單使用優惠券 - 更新優惠券為已使用

// JWT 登入
export const JWT_LOGIN_POST = `${API_SERVER}/login-jwt`;