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
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activityName, setActivityName] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [notes, setNotes] = useState("");
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  // 搜尋功能
  const [searchQuery, setSearchQuery] = useState("");
  const [originalData, setOriginalData] = useState([]);
  // 分頁
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 每頁顯示的活動數量

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listData.length / itemsPerPage);



  // 當使用者輸入時即時搜尋
  const handleSearch = (query) => {
    setSearchQuery(query);
  
    if (query.trim() === "") {
      setListData(originalData); // 還原完整資料
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = originalData.filter((activity) => {
        return (
          activity.activity_name.toLowerCase().includes(lowerQuery) ||
          activity.court_name.toLowerCase().includes(lowerQuery) ||
          activity.name.toLowerCase().includes(lowerQuery)
        );
      });
      setListData(filtered);
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const bootstrap = require("bootstrap");
      if (modalRef.current) {
        bsModal.current = new bootstrap.Modal(modalRef.current);
      }
    }
  }, []);

    const openModal = () => {
      if (bsModal.current) bsModal.current.show();
    };
    
    const closeModal = () => {
      if (bsModal.current) bsModal.current.hide();
    };


    // 新增報名資料至資料庫
    const fetchData = async () => {
      try {
        const r = await fetch(`${AL_LIST}`);
        const obj = await r.json();
        if (obj.success) {
          setOriginalData(obj.rows);  // 儲存完整活動資料
          setListData(obj.rows);      // 顯示在畫面上的活動資料
        }
      } catch (error) {
        console.warn(error);
      }
    };
    
    // ✅ 報名送出後可以使用
    const handleRegister = async () => {
      setLoading(true);
    
      if (!activityName || !activityName.al_id) {
        alert("請選擇活動");
        setLoading(false);
        return;
      }
    
      const formData = {
        member_id: 35,
        activity_id: activityName?.al_id,
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
          setNotes("");
          setSelectedPeople(1);
          closeModal();
          await fetchData(); // 正確呼叫更新列表
        }
      } catch (error) {
        console.error("報名失敗", error);
      } finally {
        setLoading(false);
      }
    };
    
    // 初次載入資料
    useEffect(() => {
      fetchData();
    }, []);
  console.log("data:", listData);  // end Modal 報名


  const handleSortChange = (sortBy) => {
    const sorted = [...listData]; // 複製一份原始資料

    switch (sortBy) {
      case "date":
        sorted.sort(
          (a, b) => new Date(b.activity_time) - new Date(a.activity_time)
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
          <div className={`${Styles.selectGroup}`}>
  <input
    type="text"
    placeholder="搜尋活動名稱、地點、主揪…"
    className={Styles.searchInput}
    onChange={(e) => handleSearch(e.target.value)}
  />
</div>

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
      {currentItems.length > 0 ? (
  currentItems.map((activity, i) => (
    <ActivityCard
      key={i}
      activity={activity}
      onQuickSignUp={(activity) => {
        setActivityName(activity);
        openModal();
      }}
    />
  ))
) : (
  <p className={`${Styles.noData}`}>目前沒有活動</p>
)}

      </div>

      {/* 分頁按鈕 */}
      <div className={Styles.containerPage}>
  <nav aria-label="Page navigation">
    <ul className="pagination justify-content-center">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          «
        </button>
      </li>
      {Array.from({ length: totalPages }, (_, i) => (
        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        </li>
      ))}
      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
          »
        </button>
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
                    value={`報名費用: 總計 ${
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
                    value={notes}
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
