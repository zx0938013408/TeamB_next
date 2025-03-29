"use client";
import React, { useState, useEffect, useRef } from "react";
import "@/styles/globals.css";
import Styles from "@/app/activity-list/activity-list.module.css";
import "@/public/TeamB_Icon/style.css";

export default function ActivityRegisteredEditModal({
  activity,
  registration, // 包含 id、num、notes 等
  onSave,
}) {
  const modalRef = useRef(null);
  const bsModal = useRef(null);

  const [num, setNum] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // 初始化 Bootstrap Modal
  useEffect(() => {
    if (typeof window !== "undefined" && modalRef.current) {
      const bootstrap = require("bootstrap");
      bsModal.current = bootstrap.Modal.getOrCreateInstance(modalRef.current);
    }
  }, []);

  // 資料變更時自動填入並打開 Modal
  useEffect(() => {
    if (registration) {
      setNum(registration.num);
      setNotes(registration.notes || "");
      if (bsModal.current) bsModal.current.show();
    }
  }, [registration]);

  const closeModal = () => {
    if (bsModal.current) bsModal.current.hide();
  };

  const handleSave = () => {
    if (typeof onSave === "function") {
      onSave({ num, notes });
    }
    closeModal();
  };

  return (
    <div
      className="modal fade"
      id="editRegistrationModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="editRegistrationLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog">
        <div className="modal-content bgc">
          <div className="modal-header">
            <h5 className={Styles.titleText} id="editRegistrationLabel">
              修改報名資訊
            </h5>
            <button type="button" className="btn-close" onClick={closeModal} />
          </div>

          <div className="modal-body">
            <div className={`row ${Styles.title}`}>
              <div className="col-1">
                {activity?.sport_name === "籃球" ? (
                  <span className={`icon-Basketball ${Styles.iconTitle}`}></span>
                ) : activity?.sport_name === "排球" ? (
                  <span className={`icon-Volleyball ${Styles.iconTitle}`}></span>
                ) : activity?.sport_name === "羽球" ? (
                  <span className={`icon-Badminton ${Styles.iconTitle}`}></span>
                ) : null}
              </div>
              <h2 className={`${Styles.titleText} col`}>
                {activity?.activity_name}
              </h2>
            </div>

            <div className={Styles.inputGroup}>
              <div className={`${Styles.selectGroup} ${Styles.group1}`}>
                <label htmlFor="people" className={Styles.peopleLabel}>
                  人數
                </label>
                <select
                  id="people"
                  name="people"
                  className={Styles.people}
                  value={num}
                  onChange={(e) => setNum(Number(e.target.value))}
                >
                  <option value={1}>1 人</option>
                  <option value={2}>2 人</option>
                  <option value={3}>3 人</option>
                  <option value={4}>4 人</option>
                </select>
              </div>

              <input
                className={Styles.inputPrice}
                type="text"
                disabled
                value={`報名費用: 總計 ${
                  activity?.payment ? activity.payment * num : 0
                } 元`}
              />

              <textarea
                className={Styles.textareaInput}
                placeholder="備註：如 3男2女"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className={Styles.cancel} onClick={closeModal}>
              取消
            </button>
            <button
              type="button"
              className={Styles.register}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "儲存中..." : "儲存變更"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
