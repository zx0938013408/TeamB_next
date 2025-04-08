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
  const [shippingMethod, setShippingMethod] = useState('')
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

  // 優惠券
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [selectedCouponAmount,setSelectedCouponAmount] = useState(0);
  
  const handleCouponChange = (selectedOption) => {
    // 找到選中的優惠券
    const selected = coupons.find(coupon => coupon.user_coupon_id === selectedOption.value);
    
    if (selected) {
      // 更新選中的優惠券狀態
      setSelectedCoupon(selected); // 更新選中的優惠券物件
      setSelectedCouponAmount(selected.amount); // 更新選中的優惠金額
      
      // 如果選中的優惠券還沒使用過，更新 is_used 為 true
      if (!selected.is_used) {
        selected.is_used = true; // 改變 is_used 屬性
      }
      
      // 更新 localStorage
      localStorage.setItem('selectedCoupon', JSON.stringify(selected)); // 存儲整個物件
      localStorage.setItem('selectedCouponAmount', selected.amount.toString()); // 存儲金額
  
      // 這裡可以選擇發送一個 API 請求來將後端資料更新為已使用狀態
    }
  };
  // const handleCouponChange = (selectedOption) => {
  //   // 先檢查 selectedOption 是否有值
  //   if (selectedOption) {
  //     // 找到選中的優惠券物件
  //     const selected = coupons.find(coupon => coupon.user_coupon_id === selectedOption.value);
  
  //     if (selected) {
  //       // 存儲選中的優惠券
  //       setSelectedCoupon(selected);
  //       setSelectedCouponAmount(selected.amount);
  
  //       // 更新 localStorage
  //       localStorage.setItem('selectedCoupon', JSON.stringify(selected));
  //       localStorage.setItem('selectedCouponAmount', selected.amount.toString());
  //     }
  //   } else {
  //     // 使用者清除選擇時的處理
  //     setSelectedCoupon(null);
  //     setSelectedCouponAmount(0);
  //     localStorage.removeItem('selectedCoupon');
  //     localStorage.removeItem('selectedCouponAmount');
  //   }
  // };
  // const handleCouponChange = (couponId) => {
  //   const selected = coupons.find(coupon => coupon.user_coupon_id === couponId);
  
  //   if (selected) {
  //     setSelectedCoupon(selected); // 存整個物件也 OK
  //     setSelectedCouponAmount(selected.amount);
  
  //     localStorage.setItem('selectedCoupon', JSON.stringify(selected));
  //     localStorage.setItem('selectedCouponAmount', selected.amount.toString());
  //   } else {
  //     // 使用者清除選擇時的 fallback
  //     setSelectedCoupon(null);
  //     setSelectedCouponAmount(0);
  //     localStorage.removeItem('selectedCoupon');
  //     localStorage.removeItem('selectedCouponAmount');
  //   }
  // };
  // const handleCouponChange = (e) => {
  //   const couponId = parseInt(e.target.value);
  //   const selected = coupons.find(coupon => coupon.user_coupon_id === couponId);
  
  //   if (selected) {
  //     setSelectedCoupon(selected); // ⬅️ 存整個物件
  //     setSelectedCouponAmount(selected.amount);
  
  //     localStorage.setItem('selectedCoupon', JSON.stringify(selected)); // ⬅️ 存整個物件
  //     localStorage.setItem('selectedCouponAmount', selected.amount.toString());
  //   }
  // };
  // const handleCouponChange = (couponId) => {
  //   const selected = coupons.find(coupon => coupon.user_coupon_id === couponId);
  //   if (selected) {
  //     setSelectedCoupon(selected); // ✅ 存整個物件
  //     setSelectedCouponAmount(selected.amount);
  
  //     localStorage.setItem('selectedCoupon', JSON.stringify(selected)); // ✅ 存 JSON 字串
  //     localStorage.setItem('selectedCouponAmount', selected.amount.toString());
  //   }
  // };
  // const handleCouponChange = (couponId) => {
  //   // 找到選中的優惠券
  //   const selected = coupons.find(coupon => coupon.user_coupon_id === couponId);
    
  //   if (selected) {
  //     // 設置 selectedCoupon 為優惠券的詳細資訊物件
  //     setSelectedCoupon({
  //       user_coupon_id: selected.user_coupon_id,
  //       amount: selected.amount,
  //       // 可以加上其他你需要的字段
  //     });
  
  //     // 存儲選中的優惠券詳細資訊到 localStorage
  //     localStorage.setItem('selectedCoupon', JSON.stringify({
  //       user_coupon_id: selected.user_coupon_id,
  //       amount: selected.amount,
  //     }));
  //   }
  // };
  // const handleCouponChange = (couponId) => {
  //   const selected = coupons.find(coupon => coupon.user_coupon_id === couponId);
  //   if (selected) {
  //     setSelectedCoupon(couponId);
  //     setSelectedCouponAmount(selected.amount);

  //     // 存儲選中的優惠券到 localStorage
  //     localStorage.setItem('selectedCoupon', couponId);
  //     localStorage.setItem('selectedCouponAmount', selected.amount.toString());
  //   }
  // };
 

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
    // 先判斷此商品是否已經在購物車裡，並確認選擇的尺寸（如果有）
    const foundIndex = cartItems.findIndex(
      (cartItem) => cartItem.id === product.id
    );

    if (foundIndex !== -1) {
      // 已經在購物車裡，根據選擇的商品ID和尺寸進行數量遞增
      const updatedCartItems = [...cartItems];
      updatedCartItems[foundIndex].quantity += product.quantity;
      setCartItems(updatedCartItems);
    } else {
      // 沒有在購物車裡，新增此商品並設置數量
      const newItem = { ...product, quantity: product.quantity };
      const nextCartItems = [newItem, ...cartItems];
      setCartItems(nextCartItems);
    }
  };

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
  const finalTotal = selectedItemsTotalAmount + shippingCost - selectedCouponAmount

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

    // 從localStorage取出資料，設定到coupons
    const nextCoupons = JSON.parse(localStorage.getItem('coupons')) || []
    setCoupons(nextCoupons)

    // 從localStorage取出資料，設定已選擇的優惠券和金額
     // 優惠券選擇狀態（加上 try-catch 防止錯誤）
  try {
    const savedCoupon = localStorage.getItem('selectedCoupon');
    const savedCouponAmount = parseFloat(localStorage.getItem('selectedCouponAmount')) || 0;

    if (savedCoupon) {
      const parsedCoupon = JSON.parse(savedCoupon);
      setSelectedCoupon(parsedCoupon); // ✅ 正確還原成物件
      setSelectedCouponAmount(savedCouponAmount);
    }
  } catch (error) {
    console.error("❌ 優惠券資料格式錯誤，已自動清除：", error);
    localStorage.removeItem('selectedCoupon');
    localStorage.removeItem('selectedCouponAmount');
  }

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
      // 優惠券資料同步到localStorage
      localStorage.setItem('coupons', JSON.stringify(coupons));
      localStorage.setItem('selectedCoupon', JSON.stringify(selectedCoupon)); // ✅ 修正 key 錯誤
      localStorage.setItem('selectedCouponAmount', selectedCouponAmount.toString());
    }
    // 下面會有eslint警告提醒，並不需要多加其它的變數在陣列中
    // eslint-disable-next-line
  }, [cartItems, selectedItems, shippingMethod, shippingCost, selectedPayMethod,selectedCoupon, selectedCouponAmount])

  // 清空所有購物車與訂購資訊
  const clearAll = () => {
    setCartItems([]);
    setSelectedItems([]);
    setShippingMethod(null);
    setShippingCost(0);
    setSelectedPayMethod(null);
    setSelectedCity(null);
    setSelectedArea(null);
    setAddress('');
    setRecipient({ recipientName: '', phone: '' });
    // 清除優惠券相關狀態
    setCoupons([]);
    setSelectedCoupon('');
    setSelectedCouponAmount(0);

    localStorage.removeItem('cart');
    localStorage.removeItem('selectedItems');
    localStorage.removeItem('shippingMethod');
    localStorage.removeItem('shippingCost');
    localStorage.removeItem('selectedPayMethod');
    localStorage.removeItem('coupons');
    localStorage.removeItem('selectedCoupon');
    localStorage.removeItem('selectedCouponAmount');
  };

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
        coupons,
        setCoupons,
        selectedCoupon,
        setSelectedCoupon,
        selectedCouponAmount,
        setSelectedCouponAmount,
        handleCouponChange,
        clearAll // 新增清空所有資訊的函數
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
