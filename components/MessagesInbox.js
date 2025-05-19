import { useEffect, useState } from "react";

export default function MessagesInbox({ memberId }) {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const res = await fetch(`http://localhost:3001/messages/${memberId}`);
    const data = await res.json();
    if (data.success) setMessages(data.messages);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    await fetch(`http://localhost:3001/messages/read/${id}`, {
      method: "PUT",
    });
    fetchMessages();
  };

  const deleteMessage = async (id) => {
    await fetch(`http://localhost:3001/messages/${id}`, {
      method: "DELETE",
    });
    fetchMessages();
  };

  return (
    <div>
      <h2>我的訊息</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
            <strong>{msg.title}</strong>
            <p>{msg.content}</p>
            <small>{msg.created_at}</small>
            <br />
            {!msg.is_read && (
              <button onClick={() => markAsRead(msg.id)}>標記為已讀</button>
            )}
            <button onClick={() => deleteMessage(msg.id)}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
