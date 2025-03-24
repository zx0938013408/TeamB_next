'use client'

import styles from '@/app/cart/cart.module.css'
import orderStyles from './orderResult.module.css'
import Button1 from '../cart/_components/button1'
import Button2 from '../cart/_components/button2'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

export default function OrderResultPage() {
  return (
    <>
      <Header/>
      <Navbar/>
      <div className={styles.list}>
        {/* step */}
      <div className={styles.stepContainer}>
        <div className={styles.stepper}>
          <div className={styles.stepper2}>
            <div className={styles.inline}>
              <div className={styles.leftDivider}></div>
              <div className={styles.buttonIcon}>
                <div className={styles.icon}>
                  <svg
                    className={styles.check}
                    width={17}
                    height={16}
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8333 4L6.49996 11.3333L3.16663 8"
                      stroke="#FFF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className={styles.rightDivider}></div>
            </div>
            <div className={styles.verticalTitle}>
              <div className={styles.step} style={{ color: '#528F7C' }}>
                確認購物車清單
              </div>
            </div>
          </div>

          <div className={styles.stepper2}>
            <div className={styles.inline}>
              <div className={styles.leftDivider2}></div>
              <div className={styles.buttonIcon}>
                <div className={styles.icon}>
                  <svg
                    className={styles.check2}
                    width={17}
                    height={16}
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8333 4L6.49996 11.3333L3.16663 8"
                      stroke="#FFF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className={styles.rightDivider}></div>
            </div>
            <div className={styles.verticalTitle}>
              <div className={styles.step} style={{ color: '#528F7C' }}>
                填寫訂購資訊
              </div>
            </div>
          </div>

          <div className={styles.stepper2}>
            <div className={styles.inline}>
              <div className={styles.leftDivider2}></div>
              <div className={styles.buttonIcon}>
                <div
                  className={styles.icon}
                  style={{ background: '#528F7C', border: '2px solid #528F7C' }}
                >
                  <span className={styles.stepNumber} style={{color: '#FFF'}}>3</span>
                </div>
              </div>
              <div className={styles.rightDivider2}></div>
            </div>
            <div className={styles.verticalTitle}>
              <div className={styles.step} style={{color:'#528F7C',textShadow: '2px 2px 4px rgba(255, 255, 255, 0.6), -2px -2px 4px rgba(0, 0, 0, 0.3)'}}>訂單成立</div>
            </div>
          </div>
        </div>
      </div>
        < div className={orderStyles.container}> 
          <img src="/photo/result.png" alt="" />
          <div className={orderStyles.title}>訂購完成</div>
          <div className={orderStyles.message}>感謝您的訂購，我們已收到您的訂單！</div>
          {/* <div>訂單編號:</div> */}
          <div className ={styles.btn}>
            <Button1 text="回首頁" href="/" />
            <Button2 text="查看訂單記錄" href="/orderHistory" />
        </div>
      </div>
      </div>
      <Footer/>
    </>
  )
}
