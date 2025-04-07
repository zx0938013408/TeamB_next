"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import "@/styles/AiChatWidget.modal.css";
import { useAuth } from "@/context/auth-context";

export default function AiChatWidget() {
  const { auth } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");

      if (auth?.id && auth.id !== 0) {
        socket.send(
          JSON.stringify({
            type: "auth",
            memberId: auth.id,
          })
        );
        console.log("🔐 已發送會員 ID 給 WebSocket：", auth.id);
      } else {
        console.warn("⚠️ 尚未登入，無法綁定身份");
      }
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "chat") {
        setMessages((prev) => [...prev, msg]);
      }
    };

    return () => socket.close();
  }, [auth]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      type: "chat",
      sender: "user",
      message: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    socketRef.current.send(JSON.stringify(userMessage));
    setInput("");
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="chat-toggle-button">
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <h2>🤖 AI 客服</h2>
            <button onClick={() => setIsOpen(false)} className="close-button">
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${
                  msg.sender === "user" ? "user-message" : "ai-message"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.message }}
              ></div>
            ))}
          </div>

          <div className="chat-input-bar">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="請輸入訊息..."
            />
            <button onClick={sendMessage}>發送</button>
          </div>
        </div>
      )}
    </>
  );
}
