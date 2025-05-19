import { useState, useEffect, useRef } from "react";
import "@/public/TeamB_Icon/style.css";
import "@/styles/NotificationBell.css";

export default function NotificationBell({ memberId, isOpen, onClick }) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:3001/messages/${memberId}`);
    const data = await res.json();
    if (data.success) {
      setMessages(data.messages);
      setUnreadCount(data.messages.filter((m) => !m.is_read).length);
    }
  };

  useEffect(() => {
    if (!memberId) return;
    fetchMessages();

    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("✅ WebSocket 已連接");
      socket.send(JSON.stringify({ type: "auth", memberId }));
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "new-message") {
          console.log("🔔 收到即時通知：", msg.data);
          setMessages((prev) => [msg.data, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      } catch (err) {
        console.error("📛 WebSocket 訊息解析錯誤", err);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket 錯誤", err);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket 已關閉");
    };

    return () => {
      socket.close();
    };
  }, [memberId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (memberId) fetchMessages();
    }, 60000);
    return () => clearInterval(interval);
  }, [memberId]);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:3001/messages/read/${id}`, { method: "PUT" });
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    await fetch(`http://localhost:3001/messages/${id}`, { method: "DELETE" });
    fetchMessages();
  };

  return (
    <div className="notification-wrapper">
      <button
        onClick={onClick}
        className="notification-button"
      >
        <span className="icon-Bell notification-bell"></span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-inbox">
          <h4>通知訊息</h4>
          {messages.length === 0 && <p>目前沒有訊息</p>}
          {messages.map((msg, index) => (
            <div
              key={msg.id || `${index}-${msg.title}-${msg.content}`}
              className="notification-message"
            >
              <strong>{msg.title}</strong>
              <p>{msg.content}</p>
              <small>{new Date(msg.created_at).toLocaleString()}</small>
              <div className="notification-actions">
                {!msg.is_read && (
                  <button onClick={() => markAsRead(msg.id)}>標記為已讀</button>
                )}
                <button onClick={() => deleteMessage(msg.id)}>刪除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
