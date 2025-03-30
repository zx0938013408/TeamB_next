'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import styles from './OrderList.module.css'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { ORDER_LIST, AVATAR_PATH, API_SERVER } from '@/config/orders-api-path'

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false)
  const [infoExpanded, setInfoExpanded] = useState(false);  // 控制收件人等資訊的顯示
  const imageUrl = `${AVATAR_PATH}${order.products.image}`;

  if (!order || !Array.isArray(order.products)) {
    return <div>訂單資料異常，無法顯示</div>
  }

  // 時間顯示YYYY年MM月DD日 HH:MM:SS
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,  // 24小時制
    }).replace(/\//g, "年").replace(" ", "日 ");
  };

  // 取消訂單
  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/cancel/${orderId}`, {
        method: "PUT", // 使用 PUT 方法來取消訂單
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert("訂單已成功取消");
  
        // 更新 UI
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, order_status_id: 5, status: "已取消" } : order
          )
        );
      } else {
        alert(result.error || "取消訂單失敗");
      }
    } catch (error) {
      console.error("取消訂單時發生錯誤:", error);
      alert("取消訂單時發生錯誤，請稍後再試");
    }
  };

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

       {/* 顯示訂單資訊的區塊 */}
       <div className={styles.toggleInfo}>
        <div className={styles.toggleCell}>
          <button className={styles.toggleButton} onClick={() => setInfoExpanded(!infoExpanded)}>
            {infoExpanded ? '收回訂單資訊' : '檢視訂單資訊'}
            {infoExpanded ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </button>
        </div>
        {infoExpanded && (
          <div className={styles.detailFrame}>
            <div className={styles.detail}>
              <span>收件人:</span> 
              <span>{order.recipient_name}</span>
            </div>
            <div className={styles.detail}>
              <span>付款方式:</span> 
              <span>{order.paymentMethod}</span>
            </div>
            <div className={styles.detail}>
              <span>運送方式:</span> 
              <span>{order.shippingMethod}</span>
            </div>
            {order.shippingMethod === '宅配' ? (
              <div className={styles.detail}>
                <span>宅配地址:</span> 
                <span>{order.cityName} {order.areaName} {order.homeAddress}</span>
              </div>
            ) : (
              order.storeName && order.storeAddress && (
                <div>
                  <div className={styles.detail}>
                    <span>超商門市:</span> 
                    <span>{order.storeName}</span>
                  </div>
                  <div className={styles.detail}>
                    <span>門市地址:</span> 
                    <span>{order.storeAddress}</span>
                  </div>
                </div>
              )
            )}
            <div className={styles.detail}>
              <span>訂單成立時間:</span> 
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.total}>
        總金額: <p className={styles.amount}>NT${order.totalAmount.toLocaleString()}</p>
      </div>
         {/* 顯示取消訂單按鈕 */}
      {order.status === "待出貨" && (
        <div className={styles.cancelButtonContainer}>
          <button className={styles.cancelButton} onClick={() => handleCancelOrder(order.MerchantTradeNo)}>
            取消訂單
          </button>
        </div>
      )}
    </div>
  )
}

const OrderTable = () => {
  const { auth } = useAuth()
  const [selectedTab, setSelectedTab] = useState(1) // 預設顯示「待出貨」
  const [orders, setOrders] = useState([])
  const [timeFilter, setTimeFilter] = useState('') // 日期篩選
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // 設定訂單狀態分類
  const tabs = [
    { key: 1, label: '待出貨' },
    { key: 2, label: '配送中' },
    { key: 3, label: '已送達' },
    { key: 4, label: '已完成' },
    { key: 5, label: '已取消' },
  ]

  // 設計時間篩選
  const calculateDateRange = (filter) => {
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);
  
    switch (filter) {
      case '一星期':
        start.setDate(today.getDate() - 7);
        break;
      case '一個月':
        start.setMonth(today.getMonth() - 1);
        break;
      case '全部':
        start = null;  // 不篩選日期
        end = null;
        break;
      default:
        break;
    }
  
    setStartDate(start ? start : null);
    setEndDate(end ? end : null);
  };

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
          created_at: item.created_at, // 記錄訂單成立日期
          recipient_name: item.recipient_name,  // 收件人
          paymentMethod: item.paymentMethod,    // 付款方式
          shippingMethod: item.shippingMethod,
          storeName: item.storeName || null,  // 確保有超商資料才填入
          storeAddress: item.store_address || null,  // 確保有超商資料才填入
          cityName: item.city_name || null,  // 縣市
          areaName: item.area_name || null,  // 區域
          homeAddress: item.detailed_address || null,  // 宅配地址
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

    // 根據日期篩選
    const filteredOrders = Object.values(grouped).filter(order => {
      const orderDate = new Date(order.created_at); // 訂單日期
      const isAfterStartDate = !startDate || orderDate >= startDate;
      const isBeforeEndDate = !endDate || orderDate <= endDate;
      const isMatchingStatus = selectedTab ? order.order_status_id === selectedTab : true;
      return isAfterStartDate && isBeforeEndDate && isMatchingStatus;
    });

    // 這裡對 grouped 進行排序，根據訂單成立日期排序
    const sortedOrders = filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return sortedOrders
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
  }, [auth?.id, selectedTab, startDate, endDate])



  return (
  <>
    {/* 日期篩選 */}
    <div className={styles.timeFilter}>
      <label htmlFor="timeFilter" className={styles.timeFilterLabel}>
      依日期範圍篩選：
      </label>
      <select 
        id="timeFilter"
        value={timeFilter}
        onChange={(e) => {
          setTimeFilter(e.target.value);
          calculateDateRange(e.target.value);  // 更新篩選時間
        }}
      >
        {/* 預設選項作為提示 */}
        <option value="" disabled>請選擇</option> 
        <option value="全部">全部</option>
        <option value="一星期">一星期</option>
        <option value="一個月">一個月</option>
      </select>
    </div>

    {/* 選擇訂單狀態 */}
    <div className={styles.tabContainer}> 
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
    </div>

    {/* 訂單 */}
    <div className={styles.list}>
      <div className={styles.order}>
        {orders.length > 0 ? (
          orders.map(order => <OrderItem key={order.orderId} order={order} />)
        ) : (
          <div className={styles.noOrders}>尚未有訂單</div>
        )}
      </div>
    </div>
  </>
  )
}

export default OrderTable