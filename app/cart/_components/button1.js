'use client'
import styles from './button.module.css'
import Link from 'next/link'

export default function Button1({ text, href }) {
  return (
    <>
      <Link  href={href} className={styles.link}>
        <button className={styles.button}>{text}</button>
      </Link>
    </>
  )
}

