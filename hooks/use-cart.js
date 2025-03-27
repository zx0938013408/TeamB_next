'use client'

import { useState, createContext, useContext, useEffect,useMemo } from 'react'
// 1. 建立與導出context
// 傳入參數值是defaultValue(預設值)
// 使用null值通常是為了定義類型(ts)或專門除錯用，也可以提供有意義的預設值
// 也有在p-c關係結構錯誤或失敗時得到的值的意義
const CartContext = createContext(null)

// 配合瀏覽器上的react devtools可以看到名稱，方便除錯用
// 如果沒指定，都是使用`Context`

// !!!!建議: 建立完context要先用react開發工具看是否有加上provider
CartContext.displayName = 'CartContext'

// 導出(多重/部份導出) Provider元件(包含value屬性)
// 建立一個Provider元件，自訂這個勾子所需的context用的狀態值
export function CartProvider({ children }) {
  // 購物車項目狀態
  const [cartItems, setCartItems] = useState([])

  // 勾選狀態，儲存選中的商品物件 (包括商品的ID和數量)
  const [selectedItems, setSelectedItems] = useState([])

  // 運送方式
  const [shippingMethod, setShippingMethod] = useState("")
  // 運費
  const [shippingCost, setShippingCost] = useState(0)

  // 付款方式
  const [selectedPayMethod, setSelectedPayMethod ] = useState('')

  // 宅配地址
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [address, setAddress] = useState('');
  
  // 新增收件人資訊的狀態
  const [recipient, setRecipient] = useState({
    recipientName: '',
    phone: ''
  })

  // 更新收件人資訊的函數
  const updateRecipient = (newData) => {
    setRecipient((prevRecipient) => ({
      ...prevRecipient,
      ...newData
    }))
  }

  
 

  // 記錄首次渲染是否完成的信號值
  const [didMount, setDidMount] = useState(false)

  

  // 處理商品數量 遞增
  const onIncrease = (cartItemId) => {
    const nextCartItems = cartItems.map((v) => {
      // 在成員(物件)中比對id為cartItemId的成員
      if (v.id == cartItemId) {
        // 如果比對出id為cartItemId的成員，展開物件後遞增count屬性(+1)
        return { ...v, quantity: v.quantity + 1 }
      } else {
        // 否則直接返回物件
        return v
      }
    })

    // 設定到狀態中
    setCartItems(nextCartItems)
  }

  // 處理商品數量 遞增
  const onDecrease = (cartItemId) => {
    const nextCartItems = cartItems.map((v) => {
      // 在成員(物件)中比對id為cartItemId的成員
      if (v.id == cartItemId) {
        // 如果比對出id為cartItemId的成員，展開物件後遞減count屬性(-1)
        return { ...v, quantity: v.quantity - 1 }
      } else {
        // 否則直接返回物件
        return v
      }
    })

    // 設定到狀態中
    setCartItems(nextCartItems)
  }

  // 刪除商品
  const onRemove = (cartItemId) => {
    const nextCartItems = cartItems.filter((v) => v.id !== cartItemId)

    // 設定到狀態中
    setCartItems(nextCartItems)
  }

  // 加入購物車
  const onAdd = (product) => {
    // 先判斷此商品是否已經在購物車裡
    const foundIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === product.id
    )

    if (foundIndex !== -1) {
      // 已經在購物車裡 ===> 作遞增
      onIncrease(product.id)
    } else {
      // 沒有在購物車裡 ===> 作新增
      // 少了一個count數量屬性(商品物件中沒數量，要購物車項目才有)
      const newItem = { ...product, quantity: 1 }
      // 加到購物車最前面
      const nextCartItems = [newItem, ...cartItems]
      setCartItems(nextCartItems)
    }
  }

  // 計算總數量&金額 陣列的reduce方法(累加/歸納)
  const totalQty = cartItems.reduce((acc, v) => acc + v.quantity, 0)
  const totalAmount = cartItems.reduce((acc, v) => acc + v.quantity * v.price, 0)

  // 切換單個商品的勾選狀態
  const onToggleChecked = (item) => {
    setSelectedItems(
      (prev) =>
        prev.some((selectedItem) => selectedItem.id === item.id)
          ? prev.filter((selectedItem) => selectedItem.id !== item.id) // 移除商品
          : [...prev, { ...item, quantity: item.quantity }] // 加入商品物件並帶上數量
    )
  }

  // 全選/取消全選
  const onCheckedAll = (e) => {
    setSelectedItems(
      e.target.checked
        ? cartItems.map((item) => ({ ...item, quantity: item.quantity }))
        : []
    ) // 全選時將所有商品物件加入 selectedItems
  }

  // 計算總共選取的商品數量
  const selectedItemsCount = selectedItems.reduce(
    (total, item) => total + item.quantity, 0)

  // 計算選取商品的總金額
  const selectedItemsTotalAmount = selectedItems.reduce(
    (total, item) => total + item.quantity * item.price, 0)


  // 付費總金額: 商品總金額 + 運費總金額
  const finalTotal = selectedItemsTotalAmount + shippingCost

  // 一開始進入網頁應用(首次渲染時間點之後)
  useEffect(() => {
    // 從localStorage取出資料，設定到cartItems狀態
    const nextCartItems = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(nextCartItems)
    // 從localStorage取出資料，設定到selectedItems狀態
    const nextSelectedItems =
      JSON.parse(localStorage.getItem('selectedItems')) || []
    setSelectedItems(nextSelectedItems)
    //
    setShippingMethod(localStorage.getItem('shippingMethod') || '')
    setShippingCost(parseFloat(localStorage.getItem('shippingCost')) || 0)
    setSelectedPayMethod(localStorage.getItem('selectedPayMethod') || '')

    // 信號值設為true，代表首次渲染已經完成
    setDidMount(true)
  }, [])

  // 之後開始操作應用(監聽狀態cartItems變化時間點之後)
  useEffect(() => {
    // 避開首次渲染
    if (didMount) {
      // 當cartItems有變動時，同步化到localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems))
      // 當selectedItems有變動時，同步化到localStorage
      localStorage.setItem('selectedItems', JSON.stringify(selectedItems))
      // 運送方式
      localStorage.setItem('shippingMethod', shippingMethod)
      localStorage.setItem('shippingCost', shippingCost.toString())
      // 付款方式
      localStorage.setItem('selectedPayMethod', selectedPayMethod)
    }
    // 下面會有eslint警告提醒，並不需要多加其它的變數在陣列中
    // eslint-disable-next-line
  }, [cartItems, selectedItems, shippingMethod, shippingCost, selectedPayMethod])

  

  return (
    <CartContext.Provider
      // 透過value屬性，將要共享的值加入後，往後代元件們傳遞
      value={{
        onAdd,
        onDecrease,
        onIncrease,
        onRemove,
        cartItems,
        totalAmount,
        totalQty,
        onToggleChecked,
        onCheckedAll,
        selectedItems,
        selectedItemsCount,
        selectedItemsTotalAmount,
        setSelectedItems,
        shippingMethod,
        setShippingMethod, // 可以讓子組件更改運送方式
        shippingCost,
        setShippingCost, // 可以讓子組件更改運費
        selectedPayMethod,
        setSelectedPayMethod ,
        finalTotal,
        recipient,  // 提供收件人資料
        updateRecipient,  // 提供更新收件人資料的函數
        selectedCity, 
        setSelectedCity,
        selectedArea, 
        setSelectedArea,
        address,
        setAddress,
        //handleShippingMethodChange,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// 導出(多重/部份導出) 專用名稱的勾子(已傳入context)
// 這是一個自訂的hook，它是一個函式，沒有參數，回傳值是useContext(CartContext)。
// 這個hook是設計專門用來讀取CartContext的值，閱讀性較佳。
// 注意: 需要使用TypeScript或是JSDoc來定義回傳值的類型，才能在編輯器中有提示或自動完成功能。
export const useCart = () => useContext(CartContext)
