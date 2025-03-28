"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { MB_LOGIN_POST, MB_EDIT_PUT } from "../config/auth.api";

const AuthContext = createContext();
/*
  1. login(): 登入
  2. logout(): 登出
  3. auth: 登入後, 取得用戶的資料
  4. getAuthHeader(): 把 token 包在 headers 裡
*/
AuthContext.displayName = "AuthContextXXXXXX";
//初始狀態，沒有登入
const emptyAuth = {
  id: 0,
  email: "",
  name: "",
  token: "",
};
const storageKey = "TEAM_B-auth"; // localStorage 的 key

export function AuthContextProvider({ children }) {
  const [auth, setAuth] = useState({ ...emptyAuth }); //預設狀態：沒有登入

  //登出：移除資料
  const logout = () => {
    console.log("登出登出");

    localStorage.removeItem(storageKey);
    setAuth({ ...emptyAuth });
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
    console.log(result);
    if (result.success) {
      localStorage.setItem(storageKey, JSON.stringify(result.data));

      // setAuth(pre => ({...pre, ...result.data}));
      const dataAfterLogin = { ...result.data };
      // console.log({ dataAfterLogin })
      setAuth(dataAfterLogin);
      console.log("-------");
      return result.success;
    }
  };

  const getAuthHeader = () => {
    if (!auth.token) return {};
    return {
      Authorization: `Bearer ${auth.token}`,
    };
  };

  const updateUserData = async (updatedData) => {
    try {
      // const response = await fetch(MB_EDIT_PUT, {
      //   method: 'PUT',
      //   headers: getAuthHeader(),
      //   body: updatedData,
      // });
      // const result = await response.json();

      const formData = new FormData();
      formData.append("avatar", updatedData.avatar);
      formData.append("name", updatedData.name);
      formData.append("gender", updatedData.gender);
      formData.append("phone", updatedData.phone);
      formData.append("city_id", updatedData.city_id);
      formData.append("area_id", updatedData.area_id);
      formData.append("address", updatedData.address);
      formData.append("sport", updatedData.sport);

      const response = await fetch(MB_EDIT_PUT, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        console.log("用戶資料更新成功");

        const updatedUser = data.user;
        
        let localAuth = JSON.parse(localStorage.getItem(storageKey));
        localAuth.phone = data.user.phone;
        localAuth.avatar = data.user.avatar;
        localAuth.gender = data.user.gender;
        localAuth.name = data.user.name;
        localAuth.city = data.user.city;
        localAuth.address = data.user.address;
        localAuth.sports = data.user.sport;
        setAuth(localAuth);
        localStorage.setItem(storageKey, JSON.stringify(localAuth));
        return true;
      } else {
        console.log("更新失敗", data.message);
        return false;
      }
    } catch (error) {
      console.error("更新用戶資料時出錯：", error);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem(storageKey);
    if (data) {
      try {
        const authData = JSON.parse(data);
        console.log({ XXXX: authData });

        if (authData.token) {
          // 確保 token 存在
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
    <AuthContext.Provider
      value={{ auth, logout, login, getAuthHeader, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
