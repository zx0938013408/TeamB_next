"use client";

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/member-activity-edit/EditContent.module.css';

const EditContent = () => {
  const [editStates, setEditStates] = useState(Array(6).fill(false));
  const [fieldValues, setFieldValues] = useState(Array(6).fill("H6-揪團打球因何而發生？")); // 初始值
  const editTextContainers = useRef([]);

  useEffect(() => {
    // 從 localStorage 載入資料
    const loadedValues = Array(6).fill("H6-揪團打球因何而發生？");
    for (let i = 0; i < 6; i++) {
      const saved = localStorage.getItem(`savedText-${i}`);
      if (saved) {
        loadedValues[i] = saved;
      }
    }
    setFieldValues(loadedValues);
  }, []);

  const toggleEdit = (index) => {
    const newEditStates = [...editStates];
    const newFieldValues = [...fieldValues];
    newEditStates[index] = !newEditStates[index];
    setEditStates(newEditStates);

    if (newEditStates[index]) {
      // 編輯狀態開啟，設定編輯框的文字
      if (editTextContainers.current[index]) {
        editTextContainers.current[index].innerText = fieldValues[index];
      }
    } else {
      // 編輯狀態關閉，儲存文字
      if (editTextContainers.current[index]) {
        const updatedText = editTextContainers.current[index].innerText.trim();
        newFieldValues[index] = updatedText;
        setFieldValues(newFieldValues);
        localStorage.setItem(`savedText-${index}`, updatedText);
      }
    }
  };

  return (
    <section className={styles['activity-edit']}>
      <h2 className={styles['section-title']}>活動內文修改</h2>
      <div className={styles['edit-content']}>
        <div className={styles['edit-column']}>
          {[0, 1, 2].map((index) => (
            <div className={styles['edit-wrapper']} key={index}>
              <div className={styles['edit-field']} style={{ display: editStates[index] ? 'none' : 'flex' }}>
                <div className={styles['field-content']}>
                  <label className={styles['field-title']}>{index === 1 ? '地點' : '名稱'}</label>
                  <p className={styles['field-value']}>{fieldValues[index]}</p>
                </div>
                <button className={styles['edit-button']} onClick={() => toggleEdit(index)}>
                  <span className="icon-Edit"></span>
                </button>
              </div>
              <div
                className={styles['edit-container']}
                style={{ display: editStates[index] ? 'block' : 'none' }}
              >
                <div className={styles['edit-content']}>
                  <div className={styles['edit-title']}>{index === 1 ? '地點' : '名稱'}</div>
                  <div className={styles['edit-box']}>
                    <div
                      ref={(el) => (editTextContainers.current[index] = el)}
                      className={styles['edit-text-container']}
                      contentEditable="true"
                    ></div>
                  </div>
                </div>
                <button className={styles['close-button']} onClick={() => toggleEdit(index)}>
                  <span className="icon-Dropup"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className={styles['edit-column']}>
          {[3, 4, 5].map((index) => (
            <div className={styles['edit-wrapper']} key={index}>
              <div className={styles['edit-field']} style={{ display: editStates[index] ? 'none' : 'flex' }}>
                <div className={styles['field-content']}>
                  <label className={styles['field-title']}>名稱</label>
                  <p className={styles['field-value']}>{fieldValues[index]}</p>
                </div>
                <button className={styles['edit-button']} onClick={() => toggleEdit(index)}>
                  <span className="icon-Edit"></span>
                </button>
              </div>
              <div
                className={styles['edit-container']}
                style={{ display: editStates[index] ? 'block' : 'none' }}
              >
                <div className={styles['edit-content']}>
                  <div className={styles['edit-title']}>名稱</div>
                  <div className={styles['edit-box']}>
                    <div
                      ref={(el) => (editTextContainers.current[index] = el)}
                      className={styles['edit-text-container']}
                      contentEditable="true"
                    ></div>
                  </div>
                </div>
                <button className={styles['close-button']} onClick={() => toggleEdit(index)}>
                  <span className="icon-Dropup"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditContent;