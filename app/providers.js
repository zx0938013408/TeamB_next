'use client'

// 此檔案專門使用於包裹所有的Provider(提供者)元件，
// 這樣可以在所有頁面(包含其中的元件中)使用context

// 會員認証/授權
import { AuthProvider } from '@/hooks/use-auth'
// 購物車
import { CartProvider } from '@/hooks/use-cart'


export default function Providers({ children }) {
  return (
    
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
   
  )
}
