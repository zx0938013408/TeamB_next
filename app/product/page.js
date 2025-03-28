'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
import { ToastContainer, toast } from 'react-toastify'


// 商品列表
const initialProducts = [
  {
    id: "1",
    product_name: "Pro Max Dri-FIT 運動短袖",
    price: 890,
    image:
      "top (1).jpg",
    size: "L", 
    color: "白色" 
    
  },
  {
    id: "2",
    product_name: "Elite 長袖壓縮衣",
    price: 920,
    image:
      "/top (2).jpg",
    size: "L", 
    color: "白色",
    
  },
  {
    id: "3",
    product_name: "Essential 運動背心",
    price: 750,
    image:
      "/top (3).jpg",
    size: "M", 
    color: "灰色"
   
  },
]

export default function ProductPage() {
  // 從useCart解構所需的context的value屬性
  const { onAdd } = useCart()

  // 土司通知訊息
  const notify = (name) => {
    toast.success(`${name} 已成功加入購物車!`)
  }

  return (
    <>
      <h1>商品列表</h1>
      <Link href="/cart">購物車</Link>
      <hr />
      <div title="商品列表">
        <ul>
          {initialProducts.map((v) => {
            return (
              <li key={v.id}>
                <img src={v.image} alt={v.product_name} />{v.product_name} / NT${v.price}
                <button
                  onClick={() => {
                    onAdd(v)
                    // 跳出成功通知訊息
                    notify(v.product_name)
                  }}
                >
                  加入購物車
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {/* 土司通知訊息要使用的 */}
      <ToastContainer />
    </>
  )
}
