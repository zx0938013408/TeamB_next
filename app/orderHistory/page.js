'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import styles from './OrderList.module.css'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { ORDER_LIST, AVATAR_PATH } from '@/config/orders-api-path'

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
    const imageUrl = `${AVATAR_PATH}${order.products.image}`;

  if (!order || !Array.isArray(order.products)) {
    return <div>訂單資料異常，無法顯示</div>
  }

  return (
    <div className={styles.orderContainer}>
      <div className={styles.title}>
        <div className={styles.titleName}>
          <div>訂單編號:</div>&nbsp;&nbsp;
          <div className={styles.idName}>{order.MerchantTradeNo}</div>
        </div>
      </div>

      <table className={styles.table}>
        <tbody>
          {order.products.map((product, index) =>
            (index === 0 || expanded) && (
              <tr key={`${order.orderId}-${product.product_id}`} className={styles.item}>
                <td>
                  <img 
                  src={product.image ? `${AVATAR_PATH}${product.image}` : `${AVATAR_PATH}TeamB-logo-greenYellow.png`} 
                  alt={product.product_name} 
                  />
                  </td>
                <td className={styles.name}>{product.product_name}</td>
                <td className={styles.spec}><p>{product.size}</p><p>{product.color}</p></td>
                <td className={styles.price}>NT${(product.price ?? 0).toLocaleString()}</td>
                <td className={styles.count}>
                  <div className={styles.quantityControls}>×{product.quantity}</div>
                </td>
              </tr>
            )
          )}
          {order.products.length > 1 && (
            <tr>
              <td colSpan="5" className={styles.toggleCell}>
                <button className={styles.toggleButton} onClick={() => setExpanded(!expanded)}>
                  {expanded ? '收回' : '檢視其他商品'}
                  {expanded ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.total}>
        總金額: <p className={styles.amount}>NT${order.totalAmount.toLocaleString()}</p>
      </div>
    </div>
  )
}

const OrderTable = () => {
  const { auth } = useAuth()
  const [selectedTab, setSelectedTab] = useState(4) // 預設顯示「已完成」
  const [orders, setOrders] = useState([])

  const tabs = [
    { key: 1, label: '待出貨' },
    { key: 2, label: '配送中' },
    { key: 3, label: '已送達' },
    { key: 4, label: '已完成' },
    { key: 5, label: '已取消' },
  ]

  const groupOrders = (rawData) => {
    const grouped = {}

    rawData.forEach(item => {
      const id = item.orderId

      if (!grouped[id]) {
        grouped[id] = {
          orderId: id,
          MerchantTradeNo: item.MerchantTradeNo,
          totalAmount: item.total_amount,
          status: item.status,
          order_status_id: item.order_status_id,
          products: [],
        }
      }

      grouped[id].products.push({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image
      })
    })

    return Object.values(grouped)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(ORDER_LIST)
        const data = await res.json()

        if (data.success) {
          const memberId = auth.id

          const memberOrders = data.rows.filter(order =>
            Number(order.member_id) === Number(memberId) &&
            Number(order.order_status_id) === Number(selectedTab)
          )

          const groupedOrders = groupOrders(memberOrders)
          setOrders(groupedOrders)
        }
      } catch (error) {
        console.error("載入訂單列表失敗：", error)
      }
    }

    if (auth?.id) {
      fetchData()
    }
  }, [auth?.id, selectedTab])

  return (
    <div className={styles.list}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={selectedTab === tab.key ? styles.activeTab : ''}
            onClick={() => setSelectedTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.order}>
        {orders.length > 0 ? (
          orders.map(order => <OrderItem key={order.orderId} order={order} />)
        ) : (
          <div className={styles.noOrders}>尚未有訂單</div>
        )}
      </div>
    </div>
  )
}

export default OrderTable