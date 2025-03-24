'use client'

import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import styles from './OrderList.module.css';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import {ORDER_LIST} from '@/config/orders-api-path'

const OrderItem = ({ order }) => {
  const { finalTotal } = useCart() // 從CartContext獲取資料
  const [expanded, setExpanded] = useState(false);

  return (
    
    <div className={styles.orderContainer}>
      <div className={styles.title}>
        <div className={styles.titleName}>
          <div>訂單編號:</div>&nbsp;&nbsp;
          <div className={styles.idName}>{order.id}</div>
        </div>
      </div>
      <table className={styles.table}>
        <tbody>
          {order.products.map(({ id, name, price, picture, size, color, count }, index) =>
            (index === 0 || expanded) && (
              <tr key={id} className={styles.item}>
                <td><img src={picture} alt={name} /></td>
                <td className={styles.name}>{name}</td>
                <td className={styles.spec}><p>{size}</p><p>{color}</p></td>
                <td className={styles.price}>NT${price.toLocaleString()}</td>
                <td className={styles.count}><div className={styles.quantityControls}>×{count}</div></td>
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
      <div className={styles.total}>總金額: <p className={styles.amount}>NT${finalTotal.toLocaleString()}</p></div>
    </div>
  );
};

const OrderTable = () => {
  const { selectedItems } = useCart();
  const [selectedTab, setSelectedTab] = useState('pending');
  const tabs = [
    { key: 'pending', label: '待出貨' },
    { key: 'delivery', label: '配送中' },
    { key: 'arrived', label: '已送達' },
    { key: 'completed', label: '已完成' },
    { key: 'cancelled', label: '已取消' },
  ];
  
  const ordersData = selectedTab === 'pending' ? [
    {
      id: 'ORD123456',
      status: 'pending',
      products: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        picture: item.picture,
        size: item.size,
        color: item.color,
        count: item.count,
      })),
    },
    {
      id: 'ORD789012',
      status: 'pending',
      products: selectedItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        picture: item.picture,
        size: item.size,
        color: item.color,
        count: item.count,
      })),
    },
  ] : [];
  
  const filteredOrders = ordersData.filter(order => order.status === selectedTab);

  return (
    <div className={styles.list}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button key={tab.key} className={selectedTab === tab.key ? styles.activeTab : ''} onClick={() => setSelectedTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>
      {filteredOrders.length > 0 ? (
        filteredOrders.map(order => <OrderItem key={order.id} order={order} />)
      ) : (
        <div className={styles.noOrders}>尚未有訂單</div>
      )}
    </div>
  );
};

export default OrderTable;
