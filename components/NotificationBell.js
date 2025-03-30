import { useState, useEffect } from "react";

export default function NotificationBell({ memberId }) {
  const [messages, setMessages] = useState([]);
  const [showInbox, setShowInbox] = useState(false);
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
    if (memberId) fetchMessages();

    // 自動刷新每60秒
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
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowInbox((prev) => !prev)}
        style={{ position: "relative", background: "none", border: "none", fontSize: "24px" }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "12px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showInbox && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            width: "350px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 9999,
            padding: "10px",
          }}
        >
          <h4>通知訊息</h4>
          {messages.length === 0 && <p>目前沒有訊息</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                borderBottom: "1px solid #ddd",
                marginBottom: "8px",
                paddingBottom: "5px",
              }}
            >
              <strong>{msg.title}</strong>
              <p>{msg.content}</p>
              <small>{new Date(msg.created_at).toLocaleString()}</small>
              <br />
              {!msg.is_read && (
                <button onClick={() => markAsRead(msg.id)}>標記為已讀</button>
              )}
              <button onClick={() => deleteMessage(msg.id)}>刪除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
