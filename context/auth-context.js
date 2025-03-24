"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {MB_LOGIN_POST} from "../config/auth.api"


const AuthContext = createContext();
/*
  1. login(): 登入
  2. logout(): 登出
  3. auth: 登入後, 取得用戶的資料
  4. getAuthHeader(): 把 token 包在 headers 裡
*/

//初始狀態，沒有登入
const emptyAuth = {
  id: 0,
  email: "",
  name: "",
  token: "",
};
const storageKey = "TEAM_B-auth"; // localStorage 的 key

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({ ...emptyAuth }); 

  const logout = () => {
    localStorage.removeItem(storageKey);//移除資料
    setAuth({ ...emptyAuth }); //沒有登入的狀態：登出
  };

  //登入時傳帳號密碼進來
  const login = async (email, password) => {
   
    const r = await fetch(MB_LOGIN_POST, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await r.json();
    if (result.success) {

      localStorage.setItem(storageKey, JSON.stringify(result.data));
      setAuth(result.data);
    }
    return result.success;
  };

  const getAuthHeader = () => {
    if (!auth.token) return {};
    return {
      'Authorization': `Bearer ${auth.token}`, 
    };
  };

  useEffect(() => {
    const data = localStorage.getItem(storageKey);
    if (data) {
      try {
        const authData = JSON.parse(data);
        if (authData.token) { // 確保 token 存在
          setAuth(authData);
        } else {
          setAuth({ ...emptyAuth }); // 如果沒有有效的 token，清除 auth 資料
        }
      } catch (ex) {
        console.error("無效的 auth 資料", ex);
        setAuth({ ...emptyAuth }); // 清空資料
      }
    }
  }, []);
  

  
  return (
    <AuthContext.Provider value={{ auth, logout, login, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
