"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // 正確導入 useRouter
import { ORDER_LIST } from "@/config/orders-api-path"; // 確保這是正確的 API 路徑

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(ORDER_LIST);
        if (!response.ok) {
          throw new Error('無法取得資料');
        }
        const data = await response.json();
        setOrders(data.rows);
        setLoading(false);
      } catch (err) {
        setError('無法取得訂單資料');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>正在加載訂單資料...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>訂單列表</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.Order_id}>
              <h3>訂單編號: {order.Order_id}</h3>
              <p>會員 ID: {order.MemberID}</p>
              <p>總價: {order.TotalPrice}</p>
              <p>訂單狀態: {order.OrderStatus}</p>
              <p>付款狀態: {order.PaymentStatus}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>目前沒有訂單資料</p>
      )}
    </div>
  );
}

export default OrderList;









