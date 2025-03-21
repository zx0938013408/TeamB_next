'use client'

import { useState, createContext, useContext } from 'react'
// 1. 建立與導出context
// 傳入參數值是defaultValue(預設值)
// 使用null值通常是為了定義類型(ts)或專門除錯用，也可以提供有意義的預設值
// 也有在p-c關係結構錯誤或失敗時得到的值的意義
const AuthContext = createContext(null)

// 配合瀏覽器上的react devtools可以看到名稱，方便除錯用
// 如果沒指定，都是使用`Context`
AuthContext.displayName = 'AuthContext'

// 導出(多重/部份導出) Provider元件(包含value屬性)
// 建立一個Provider元件，自訂這個勾子所需的context用的狀態值
export function AuthProvider({ children }) {
  // 預設狀態值
  const defaultUser = { id: 0, username: '', name: '' }
  // 會員狀態
  const [user, setUser] = useState(defaultUser)

  // 會員是否是登入中
  const isAuth = !!user.id

  const login = () => {
    setUser({
      id: 1,
      username: 'harry',
      name: '哈利',
    })
  }

  const logout = () => {
    setUser(defaultUser)
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 導出(多重/部份導出) 專用名稱的勾子(已傳入context)
// 這是一個自訂的hook，它是一個函式，沒有參數，回傳值是useContext(AuthContext)。
// 這個hook是設計專門用來讀取AuthContext的值，閱讀性較佳。
// 注意: 需要使用TypeScript或是JSDoc來定義回傳值的類型，才能在編輯器中有提示或自動完成功能。
/**
 *
 * useAuth是一個hook，是設計專門用來讀取AuthContext的值的勾子。
 *
 * @typedef {Object} Auth
 * @property {number} id
 * @property {string} username
 * @property {string} name
 *
 * @returns {{user: {id: number, username: string, name: string}, isAuth: boolean, login: Function, logout: Function}}
 */
export const useAuth = () => useContext(AuthContext)
