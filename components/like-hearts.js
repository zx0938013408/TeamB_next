import { useState } from "react";
import Styles from "@/styles/like-heart.module.css";
import { TOGGLE_LIKE } from "@/config/api-path";

export default function LikeHeart({ checked = false, activityId }) {
  const [isLiked, setIsLiked] = useState(checked);

  const toggleLike = async () => {
    const userData = localStorage.getItem("TEAM_B-auth");  // 從 localStorage 讀取整個用戶對象
    const parsedUser = JSON.parse(userData);  // 解析 JSON 字符串為對象
  
    // 從解析出來的對象中獲取 token
    const token = parsedUser?.token;
  
    console.log("JWT Token: ", token);  // 確認讀取的 token 是否正確
  
    if (!token) {
      alert("您尚未登入");
      return;  // 如果沒有 token，提示用戶先登入
    }
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // 使用提取出的 token
    };
  
    console.log("Request Headers: ", headers);  // 打印標頭確認是否正確設置
  
    try {
      const res = await fetch(TOGGLE_LIKE, {
        method: "POST",
        credentials: "include",  // 如果後端需要 session，也可以保留這一行
        headers: headers,  // 使用定義的 headers
        body: JSON.stringify({ activityId }),
      });
  
      const data = await res.json();
      if (data.success) {
        setIsLiked(data.liked);  // 根據後端回傳的結果更新按鈕狀態
      } else {
        console.error("喜歡/取消喜歡操作失敗", data);
      }
    } catch (error) {
      console.error("發送請求時出錯:", error);
    }
  };
  
  
  
  return (
    <span
      className={`icon-Heart-Fill ${isLiked ? Styles.iconHeartFill : Styles.iconLikeStroke}`}
      onClick={toggleLike}
    ></span>
  );
}