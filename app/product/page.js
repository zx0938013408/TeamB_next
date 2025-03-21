'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/use-cart'
// import { ToastContainer, toast } from 'react-toastify'


// 商品列表
const initialProducts = [
  {
    id: "1",
    name: "ESSENTIALS 短版短袖上衣",
    price: 981,
    picture:
      "/photo/p1.jpg",
    size: "L", 
    color: "白色" 
    
  },
  {
    id: "2",
    name: "PUREBOOST 5 跑鞋",
    price: 4290,
    picture:
      "/photo/p2.jpg",
    size: "UK8", 
    color: "黑色",
    
  },
  {
    id: "3",
    name: "AEROREADY 運動長褲",
    price: 1859,
    picture:
      "/photo/p3.jpg",
    size: "L", 
    color: "黑色"
   
  },
]

export default function ProductPage() {
  // 從useCart解構所需的context的value屬性
  const { onAdd } = useCart()

  // 土司通知訊息
  // const notify = (name) => {
  //   toast.success(`${name} 已成功加入購物車!`)
  // }

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
                <img src={v.picture} alt={v.name} />{v.name} / NT${v.price}
                <button
                  // onClick={() => {
                  //   onAdd(v)
                  //   // 跳出成功通知訊息
                  //   notify(v.name)
                  // }}
                >
                  加入購物車
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      {/* 土司通知訊息要使用的 */}
      {/* <ToastContainer /> */}
    </>
  )
}
