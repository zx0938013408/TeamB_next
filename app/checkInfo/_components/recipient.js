'use client'

import { useState } from 'react'
import validator from 'validator'
import styles from './shipMethod.module.css'
import styles2 from './address.module.css'

export default function RecipientForm() {
  const initData = {
    recipientName: '',
    phone: '',
    address: '',
    acceptTerms: false,
  }

  const [data, setData] = useState(initData)
  const [errors, setErrors] = useState({ ...initData, acceptTerms: '' })

  const handleFieldChange = (e) => {
    if (e.target.name === 'acceptTerms') {
      return setData({ ...data, acceptTerms: e.target.checked })
    }
    return setData({ ...data, [e.target.name]: e.target.value })
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

    // if (validator.isEmpty(data.address, { ignore_whitespace: true })) {
    //   newErrors.address ||= '地址為必填'
    // }

    if (!data.acceptTerms) {
      newErrors.acceptTerms ||= '請同意收件條款'
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

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.optionFrame}>
        <div className={styles2.formFrame2}>
          <div className={styles2.name}>
            <label  htmlFor="recipientName">
              姓名
              </label>
              <input
                type="text"
                id="recipientName" 
                name="recipientName"
                value={data.recipientName}
                onChange={handleFieldChange}
                onBlur={handleBlur}
              />
            
            <div className={styles.error}>{errors.recipientName}</div>
          </div>
        <div className={styles2.name}>
          <label htmlFor="phone">
            手機號碼
          </label>
            <input
              type="text"
              id = "phone"
              name="phone"
             
              value={data.phone}
              onChange={handleFieldChange}
              onBlur={handleBlur}
            />
          <div className={styles.error}>{errors.phone}</div>
        </div>

      </div>
        {/* <button type="submit">儲存</button> */}
      </form>
    </>
  )
}


