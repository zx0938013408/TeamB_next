import { createContext, useContext } from "react";

const AuthContext = createContext();
/*
  1. login(): 登入
  2. logout(): 登出
  3. auth: 登入後, 取得用戶的資料
  4. getAuthHeader(): 把 token 包在 headers 裡
*/

export function AuthContextProvider({ children }) {
  return (
    <AuthContext.Provider value={{ v: 100 }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
