"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Styles from "./activity-list.module.css";
import "@/public/TeamB_Icon/style.css";
import { useRouter, useSearchParams } from "next/navigation";
import { AL_LIST } from "@/config/api-path";
import { ACTIVITY_ADD_POST } from "@/config/activity-registered-api-path";
import ActivityCard from "@/components/activity-list-card/ActivityCard";

export default function ActivityListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchRef = useRef();
  // const { auth, getAuthHeader } = useAuth();

  const [refresh, setRefresh] = useState(false);
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activityName, setActivityName] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [notes, setNotes] = useState("");
  const modalRef = useRef(null);

  // 新增報名資料至資料庫
  const handleRegister = async () => {
    setLoading(true);

    // 檢查 activityName 是否存在
    if (!activityName || !activityName.al_id) {
      alert("請選擇活動");
      setLoading(false);
      return;
    }

    // 設定要發送的資料
    const formData = {
      member_id: 35, // 測試用，應該從登入 session 取得
      activity_id: activityName?.al_id, // 測試用，應該根據選擇的活動變動
      num: selectedPeople,
      notes: notes.trim(),
    };
    try {
      const response = await fetch(ACTIVITY_ADD_POST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // alert("報名成功！");
        setNotes(""); // ✅ 清除輸入框
        setSelectedPeople(1); // ✅ 重設人數選擇
        // ✅ 關閉 modal
        const modalElement = document.getElementById("staticBackdrop");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        fetchRegisteredData(); // 重新載入資料
      } else {
        // alert("報名失敗：" + data.error);
      }
    } catch (error) {
      console.error("報名失敗", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      try {
        const r = await fetch(`${AL_LIST}`);
        const obj = await r.json();
        if (obj.success) {
          setListData(obj.rows);
        }
      } catch (error) {
        console.warn(error);
      }
    };
    fetchData();
    
  }, []);
  console.log("data:", listData);

  // Modal Debug
  const openModal = () => {
    const modal = document.getElementById("staticBackdrop");
    if (modal) {
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false"); // ✅ 顯示 modal
      modal.removeAttribute("inert"); // ✅ 允許焦點移入
    }
  };

  const handleSortChange = (sortBy) => {
    const sorted = [...listData]; // 複製一份原始資料

    switch (sortBy) {
      case "date":
        sorted.sort(
          (a, b) => new Date(a.activity_time) - new Date(b.activity_time)
        );
        break;
      case "location":
        sorted.sort((a, b) => a.court_name.localeCompare(b.court_name));
        break;
      case "price":
        sorted.sort((a, b) => a.payment - b.payment);
        break;
      case "people":
        sorted.sort((a, b) => b.registered_people - a.registered_people); // 等已報名人數匯入
        break;
      default:
        break;
    }

    setListData(sorted);
  };

  return (
    <>
      <div className={`${Styles.container} mx-auto ${Styles.bread}`}>
        {/* 麵包屑 */}
        <nav aria-label="breadcrumb" className={Styles.top}>
          <ol className={`${Styles.breadcrumb}`}>
            <a href="#" className={`${Styles.notActiveText}`}>
              首頁
            </a>
            <span className=""> / </span>
            <span className="active" aria-current="page">
              活動列表
            </span>
          </ol>

          {/* 篩選列 */}
          <div className={Styles.selectGroup}>
            <select
              id="people"
              name="people"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="date">依照活動日期排序</option>
              <option value="location">依照地區排序</option>
              <option value="price">依照費用排序</option>
              <option value="people">依照報名人數排序</option>
            </select>
          </div>
        </nav>
      </div>
      {/* 開團按鈕 */}
      <div className={`${Styles.container} mx-auto ${Styles.bread}`}>
        <Link href="/activity-create">
          <button className={`${Styles.create}`}>直接開團</button>
        </Link>
      </div>

      {/* 活動列表 */}
      <div className={`${Styles.container} mx-auto`}>
        {listData.length > 0 ? (
          listData.map((activity, i) => (
            <ActivityCard
              key={i}
              activity={activity}
              onQuickSignUp={setActivityName}
            />
          ))
        ) : (
          <p className={`${Styles.noData}`}>目前沒有活動</p>
        )}
      </div>

      {/* 分頁按鈕 */}
      <div className={Styles.containerPage}>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="pageItem">
              <a className="page-link pageLink" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
            <li className="pageItem">
              <a className="page-link pageLink" href="#">
                1
              </a>
            </li>
            <li className="pageItem">
              <a className="page-link pageLink" href="#">
                2
              </a>
            </li>
            <li className="pageItem">
              <a className="page-link pageLink" href="#">
                3
              </a>
            </li>
            <li className="pageItem">
              <a className="page-link pageLink" href="#" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content bgc">
            <div className="modal-header">
              <h5 className={Styles.titleText} id="staticBackdropLabel">
                報名資訊
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className={`${Styles.title} row`}>
                <div className="titleIcons col-1">
                  {activityName?.sport_name === "籃球" ? (
                    <span
                      className={`icon-Basketball ${Styles.iconTitle}`}
                    ></span>
                  ) : activityName?.sport_name === "排球" ? (
                    <span
                      className={`icon-Volleyball ${Styles.iconTitle}`}
                    ></span>
                  ) : activityName?.sport_name === "羽球" ? (
                    <span
                      className={`icon-Badminton ${Styles.iconTitle}`}
                    ></span>
                  ) : null}
                </div>
                <h2 className={`${Styles.titleText} col`}>
                  {activityName?.activity_name}
                </h2>
                {/* 人數選擇 */}
                <div className={Styles.inputGroup}>
                  <div className={`${Styles.selectGroup} ${Styles.group1}`}>
                    <label htmlFor="people" className={`${Styles.peopleLabel}`}>
                      人數
                    </label>
                    <select
                      id="people"
                      name="people"
                      className={`${Styles.people}`}
                      value={selectedPeople} // ✅ 讓 `<select>` 綁定 `useState`
                      onChange={(e) =>
                        setSelectedPeople(Number(e.target.value))
                      } // ✅ 更新 `selectedPeople`
                    >
                      <option value={1}>1 人</option>
                      <option value={2}>2 人</option>
                      <option value={3}>3 人</option>
                      <option value={4}>4 人</option>
                    </select>
                  </div>
                  <input
                    className={`${Styles.inputPrice}`}
                    type="text"
                    name=""
                    id=""
                    defaultValue={`報名費用: 總計 ${
                      activityName?.payment
                        ? activityName?.payment * selectedPeople
                        : 0
                    } 元`}
                    disabled
                  />
                  <textarea
                    className={`${Styles.textareaInput}`}
                    name=""
                    id=""
                    placeholder="備註:ex 3男2女 (填)"
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="modal-footer">
                    <button
                      type="button"
                      className={Styles.cancel}
                      data-bs-dismiss="modal"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className={Styles.register}
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? "報名中..." : "確定報名"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
