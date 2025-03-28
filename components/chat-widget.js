'use client'; 

import { useEffect, useState, useRef } from 'react';
import Styles from "@/styles/chat-widget.module.css"

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001'); // 你的後端 WebSocket port
    socketRef.current = socket;

    socket.onmessage = (event) => {
        const aiReply = event.data;
      
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          // 如果最後一則是「查詢中...」，先移除再加 AI 回覆
          if (last?.role === 'ai' && last?.content === '查詢中...') {
            return [...prev.slice(0, -1), { role: 'ai', content: aiReply }];
          } else {
            return [...prev, { role: 'ai', content: aiReply }];
          }
        });
      
        setIsLoading(false);
      };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    const userInput = inputRef.current.value.trim();
    if (!userInput) return;
  
    socketRef.current.send(userInput);
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
  
    // 顯示「查詢中...」
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'ai', content: '查詢中...' }]);
  
    inputRef.current.value = '';
  };

  return (
    <>
      {/* 圓形聊天按鈕 */}
      <div
        onClick={() => setOpen(!open)}
        className={Styles.circleIcons}
      >
        QA
      </div>

      {/* 展開的聊天視窗 */}
      {open && (
        <div
          className={Styles.chatWindow}
        >
          {/* 標題 */}
          <div className={Styles.chatTitle}>
            Team 編 的小幫手
          </div>
          {/* 聊天紀錄 */}
          <div
            className={Styles.chatContent}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${Styles.message} ${
                  m.role === 'user' ? Styles.userMessage : Styles.aiMessage
                }`}
              >
                <div
                  className={`${Styles.bubble} ${
                    m.role === 'user' ? Styles.userBubble : Styles.aiBubble
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* 輸入區 */}
          <div style={{ display: 'flex', borderTop: '1px solid #ddd' }}>
            <input
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              className={Styles.inputBox}
              placeholder="請輸入問題..."
            />
            <button
              onClick={sendMessage}
              className={Styles.sendButton}
            >
              送出
            </button>
          </div>
        </div>
      )}
    </>
  );
}