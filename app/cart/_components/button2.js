'use client'
import styles from './button.module.css'
import { useRouter } from 'next/navigation'

export default function Button2({ text, href, onClick }) {
  const router = useRouter()

  const handleClick = (e) => {
    // 執行傳進來的 onClick 函數
    const shouldProceed = onClick ? onClick(e) : true

    if (shouldProceed) {
      router.push(href) // 正常跳轉
    }
  }

  return (
    <div className={styles.link2}>
      <button  onClick={handleClick}>
        {text}
      </button>
    </div>
  )
}
// 'use client'
// import styles from './button.module.css'
// import Link from 'next/link'

// export default function Button2({ text, href, onClick  }) {
//   return (
//     <>
//       <Link  href={href} className={styles.link2}>
//         <button>{text}</button>
//       </Link>
//     </>
//   )
// }