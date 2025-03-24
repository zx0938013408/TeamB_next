'use client'

import { useRef, useState, useEffect } from "react";
import styles from './OrderList.module.css';
import { ORDER_LIST } from '@/config/orders-api-path';

const OrderItem = ({ order }) => {
    const [listData, setListData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;  // 每頁顯示的項目數

    // 計算當前頁顯示的資料
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = listData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(ORDER_LIST);
                const data = await res.json();
                if (data.success) {
                    setListData(data.rows);  // 假設返回的資料有 `rows` 屬性
                }
            } catch (error) {
                console.error("載入訂單列表失敗：", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {currentItems.length > 0 ? (
                currentItems.map((order, i) => (
                    <div key={i} className={styles.orderItem}>
                        <p className={styles.name}>{order.name}</p>
                    </div>
                ))
            ) : (
                <p className={styles.noData}>目前沒有活動</p>
            )}

            {/* 分頁控制 */}
            <div className={styles.pagination}>
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    上一頁
                </button>
                <span>第 {currentPage} 頁</span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)} 
                    disabled={indexOfLastItem >= listData.length}
                >
                    下一頁
                </button>
            </div>
        </div>
    );
};

export default OrderItem;