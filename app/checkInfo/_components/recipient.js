'use client'

import { useState, useEffect } from 'react'
import validator from 'validator'
import styles from './shipMethod.module.css'
import styles2 from './address.module.css'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/context/auth-context'

export default function RecipientForm() {
  const { recipient, updateRecipient } = useCart()  // 從購物車上下文中取得收件人資料
  const { auth } = useAuth()  // 從認證上下文中取得已登錄的會員資料

  const initData = {
    recipientName: recipient.recipientName,
    phone: recipient.phone,
  }

  const [data, setData] = useState(initData)
  const [errors, setErrors] = useState({ ...initData, acceptTerms: '' })
  const [useMemberData, setUseMemberData] = useState(false)  // 控制是否使用會員資料

  const handleFieldChange = (e) => {
    if (e.target.name === 'acceptTerms') {
      setUseMemberData(e.target.checked)  // 控制是否使用會員資料
    } else {
      const updatedData = { ...data, [e.target.name]: e.target.value }
      setData(updatedData)

      // 更新購物車中的收件人資料
      updateRecipient({ [e.target.name]: e.target.value })
    }
  }

  const validateFields = (data, errors, fieldname = '') => {
    const newErrors = {}
    Object.keys(errors).forEach((prop) => (newErrors[prop] = ''))

    if (validator.isEmpty(data.recipientName, { ignore_whitespace: true })) {
      newErrors.recipientName ||= '收件人姓名為必填'
    }

    if (!validator.isMobilePhone(data.phone, 'zh-TW')) {
      newErrors.phone ||= '請輸入有效的手機號碼'
    }

    return fieldname
      ? { ...errors, [fieldname]: newErrors[fieldname] }
      : newErrors
  }

  const handleBlur = (e) => {
    const newErrors = validateFields(data, errors, e.target.name)
    setErrors(newErrors)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateFields(data, errors)
    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error !== '')) {
      return
    }

    alert('收件資訊驗證成功，準備送出')
  }

  useEffect(() => {
    if (useMemberData && auth) {
      // 如果勾選了「套用會員資料」且會員已登入，則自動填充表單資料
      setData({
        recipientName: auth.name,
        phone: auth.phone,
      });
  
      // 同時更新 useCart 中的資料
      updateRecipient({
        recipientName: auth.name,
        phone: auth.phone,
      });
  
      // 清除錯誤訊息
      setErrors({ ...initData, acceptTerms: '' });
    } else if (!useMemberData) {
      // 如果沒有勾選，則恢復為空資料或未填資料
      setData({
        recipientName: '',
        phone: '',
      });
      updateRecipient({
        recipientName: '',
        phone: '',
      });  // 清空收件人資料
  
      // 清除錯誤訊息
      setErrors({ recipientName: '', phone: '', acceptTerms: '' });
    }
  }, [useMemberData, auth]);  // 當勾選框狀態或 auth 變更時，重新設置表單資料
  return (
    <form onSubmit={handleSubmit} className={styles.optionFrame}>
      <div className={styles.member}>
        <label>
          <input
            type="checkbox"
            name="acceptTerms"
            checked={useMemberData}
            onChange={handleFieldChange}
          />
          同步會員資料
        </label>
      </div>
      <div className={styles2.formFrame2}>
        <div className={styles2.name}>
          <label htmlFor="recipientName">
            姓名
          </label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={data.recipientName}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            disabled={useMemberData}  // 如果勾選了「套用會員資料」，禁止編輯
          />
          <div className={styles.error}>{errors.recipientName}</div>
        </div>
        <div className={styles2.name}>
          <label htmlFor="phone">
            手機號碼
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            disabled={useMemberData}  // 如果勾選了「套用會員資料」，禁止編輯
          />
          <div className={styles.error}>{errors.phone}</div>
        </div>
      </div>

    </form>
  )
}