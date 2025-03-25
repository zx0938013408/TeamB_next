'use client'
import styles from './button.module.css'
// import { useRouter } from 'next/navigation'

export default function Button2({ text, onClick ,href}) {
  // const router = useRouter()

  const handleClick = (e) => {
    // 如果有傳入 onClick 函數，則執行它
    if (onClick) {
      onClick(e);
    }
    // 如果有傳入 href，則跳轉到該網址
    if (href) {
      window.location.href = href;  // 跳轉至指定的 URL
    }
  }

  return (
    <div className={styles.link2}>
      <button  onClick={handleClick} className={styles.btn}>
        {text}
      </button>
    </div>
  )
}
