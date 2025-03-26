

// 'use client'

// import { useState } from 'react';
// import { useCart } from '@/hooks/use-cart';
// import styles from './OrderList.module.css';
// import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
// import {ORDER_LIST} from '@/config/orders-api-path'

// const OrderItem = ({ order }) => {
//   const { finalTotal } = useCart() // 從CartContext獲取資料
//   const [expanded, setExpanded] = useState(false);

//   return (
    
//     <div className={styles.orderContainer}>
//       <div className={styles.title}>
//         <div className={styles.titleName}>
//           <div>訂單編號:</div>&nbsp;&nbsp;
//           <div className={styles.idName}>{order.id}</div>
//         </div>
//       </div>
//       <table className={styles.table}>
//         <tbody>
//           {order.products.map(({ id, name, price, picture, size, color, count }, index) =>
//             (index === 0 || expanded) && (
//               <tr key={id} className={styles.item}>
//                 <td><img src={picture} alt={name} /></td>
//                 <td className={styles.name}>{name}</td>
//                 <td className={styles.spec}><p>{size}</p><p>{color}</p></td>
//                 <td className={styles.price}>NT${price.toLocaleString()}</td>
//                 <td className={styles.count}><div className={styles.quantityControls}>×{count}</div></td>
//               </tr>
//             )
//           )}
//           {order.products.length > 1 && (
//             <tr>
//               <td colSpan="5" className={styles.toggleCell}>
//                 <button className={styles.toggleButton} onClick={() => setExpanded(!expanded)}>
//                   {expanded ? '收回' : '檢視其他商品'}
//                   {expanded ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
//                 </button>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       <div className={styles.total}>總金額: <p className={styles.amount}>NT${finalTotal.toLocaleString()}</p></div>
//     </div>
//   );
// };

// const OrderTable = () => {
//   const { selectedItems } = useCart();
//   const [selectedTab, setSelectedTab] = useState('pending');
//   const tabs = [
//     { key: 'pending', label: '待出貨' },
//     { key: 'delivery', label: '配送中' },
//     { key: 'arrived', label: '已送達' },
//     { key: 'completed', label: '已完成' },
//     { key: 'cancelled', label: '已取消' },
//   ];
  
//   const ordersData = selectedTab === 'pending' ? [
//     {
//       id: 'ORD123456',
//       status: 'pending',
//       products: selectedItems.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         picture: item.picture,
//         size: item.size,
//         color: item.color,
//         count: item.count,
//       })),
//     },
//     {
//       id: 'ORD789012',
//       status: 'pending',
//       products: selectedItems.map(item => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         picture: item.picture,
//         size: item.size,
//         color: item.color,
//         count: item.count,
//       })),
//     },
//   ] : [];
  
//   const filteredOrders = ordersData.filter(order => order.status === selectedTab);

//   return (
//     <div className={styles.list}>
//       <div className={styles.tabs}>
//         {tabs.map(tab => (
//           <button key={tab.key} className={selectedTab === tab.key ? styles.activeTab : ''} onClick={() => setSelectedTab(tab.key)}>
//             {tab.label}
//           </button>
//         ))}
//       </div>
//       {filteredOrders.length > 0 ? (
//         filteredOrders.map(order => <OrderItem key={order.id} order={order} />)
//       ) : (
//         <div className={styles.noOrders}>尚未有訂單</div>
//       )}
//     </div>
//   );
// };

// export default OrderTable;


'use client'

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import styles from './OrderList.module.css';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { ORDER_LIST } from '@/config/orders-api-path';
import { useAuth } from '@/context/auth-context';

const OrderItem = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  if (!order || !Array.isArray(order.products)) {
    return <div>訂單資料異常，無法顯示</div>;
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
      {Array.isArray(order.products) &&
  order.products.map(({ product_id, product_name, price, image, size, color, quantity }, index) =>
    (index === 0 || expanded) && (
      <tr key={product_id} className={styles.item}>
        <td><img src={image} alt={product_name} /></td>
        <td className={styles.name}>{product_name}</td>
        <td className={styles.spec}><p>{size}</p><p>{color}</p></td>
        <td className={styles.price}>NT${price.toLocaleString()}</td>
        <td className={styles.count}>
          <div className={styles.quantityControls}>×{quantity}</div>
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
      <div className={styles.total}>總金額: <p className={styles.amount}>NT${order.totalAmount.toLocaleString()}</p></div>
    </div>
  );
};

const OrderTable = () => {
  const { auth } = useAuth();
  const [selectedTab, setSelectedTab] = useState(1);
  const [orders, setOrders] = useState([]);
  const [listData, setListData] = useState([]);

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
            const res = await fetch(ORDER_LIST);
            const data = await res.json();
            if (data.success) {
                console.log("API 回傳的訂單資料：", data.rows);  // 確認後端資料

                const memberId = auth.id;  
                const memberOrders = data.rows.filter(order => {
                  return order.member_id === Number(memberId) && order.order_status_id === Number(selectedTab);
                });

                const groupedOrders = groupOrders(memberOrders)
                setOrders(groupedOrders)
                console.log("篩選後的會員訂單：", groupedOrders);  

                setListData(groupedOrders);
            }
        } catch (error) {
            console.error("載入訂單列表失敗：", error);
        }
    };
    if (auth.id) {
        fetchData();
    }
}, [auth.id, selectedTab]); 

  const tabs = [
    { key: 1, label: '待出貨' },
    { key: 2, label: '配送中' },
    { key: 3, label: '已送達' },
    { key: 4, label: '已完成' },
    { key: 5, label: '已取消' },
  ];

  const filteredOrders = listData.filter(order => order.order_status_id === selectedTab);

  return (
    <div className={styles.list}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button key={tab.key} className={selectedTab === tab.key ? styles.activeTab : ''} onClick={() => {
            setSelectedTab(tab.key)
            console.log(selectedTab);  
          
            }}>
            {tab.label}
          </button>
        ))}
      </div>
      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => <OrderItem key={order.items_id} order={order} />)
      ) : (
        <div className={styles.noOrders}>尚未有訂單</div>
      )}
    </div>
  );
};

export default OrderTable;