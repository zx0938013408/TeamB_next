"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Styles from "./activity-list.module.css";
import "@/public/TeamB_Icon/style.css";
import { useRouter, useSearchParams } from "next/navigation";
import { AL_LIST } from "@/config/api-path";
import { ACTIVITY_ADD_POST } from "@/config/activity-registered-api-path";
import ActivityCard from "@/components/activity-list-card/ActivityCard";
import { useAuth } from "@/context/auth-context";
import Swal from "sweetalert2"; // 引入 SweetAlert2
import ScrollToTopButton from "@/components/ScrollToTopButton";


export default function ActivityListPage() {
  const { auth } = useAuth();
  const searchParams = useSearchParams();
  const keywordFromURL = searchParams.get("search");
  const [sortType, setSortType] = useState("date");
  const [searchInput, setSearchInput] = useState("");
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
  const [isShow, setIsShow] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [afterRegisterCallback, setAfterRegisterCallback] = useState(null);

  
  // 分頁
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 每頁顯示的活動數量

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listData.length / itemsPerPage);
  // 已報名的話
  const [registeredIds, setRegisteredIds] = useState([]);

  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 當使用者輸入時即時搜尋
  const handleSearch = (query) => {
    setSearchInput(query);
    setSearchQuery(query);
    setIsShow(true)

    if (query.trim() === "") {
      setIsShow(false);
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

  const clearSearch = () => {
    searchRef.current.value = "";
    setIsShow(false);
    fetchData(null); // ✅ 手動清除搜尋並重新抓資料
    setSearchInput("");
    router.replace("/activity-list");
  };

  // 首頁點選會自動帶入
  useEffect(() => {
    if (keywordFromURL) {
      setSearchInput(keywordFromURL); // 填入輸入框
    }
  }, [keywordFromURL]);

  // Step 2: 等 originalData 有資料再搜尋
  useEffect(() => {
    if (keywordFromURL && originalData.length > 0) {
      handleSearch(keywordFromURL);
    }
  }, [originalData]);

  // Modal
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
      const userData = localStorage.getItem("TEAM_B-auth");
      const token = userData ? JSON.parse(userData).token : "";

      const r = await fetch(`${AL_LIST}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const obj = await r.json();

      if (obj.success) {
        const now = new Date();

        // 過濾掉已過期活動
        const validActivities = obj.rows.filter((activity) => {
          const activityTime = new Date(activity.activity_time);
          return activityTime >= now; // 僅保留今天之後的活動
        });

        const sorted = [...validActivities].sort(
          (a, b) => new Date(b.activity_time) - new Date(a.activity_time)
        );

        setOriginalData(validActivities);
        setListData(sorted);
      } else {
        console.warn("API 回傳失敗", obj);
      }
    } catch (error) {
      console.warn("fetchData 錯誤:", error);
    }
  };

  // ✅ 報名送出後可以使用
  const handleRegister = async () => {
    setLoading(true);

    if (!activityName || !activityName.al_id) {
      // 顯示 SweetAlert2 提示框
      Swal.fire({
        icon: "warning",
        text: "請選擇活動", // 顯示後端回傳的訊息
        confirmButtonText: "確定",
        confirmButtonColor: "#29755D", // 修改按鈕顏色
        didClose: () =>{
          document.body.style.overflow = ''
        },
      });
      setLoading(false);
      return;
    }

    const formData = {
      member_id: auth.id,
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

        // ✅ 把剛報名的 activityId 加入已報名列表
        setRegisteredIds((prev) => [...prev, activityName.al_id]);

        // ✅ 報名成功後執行子層傳來的 callback
        if (typeof afterRegisterCallback === "function") {
          afterRegisterCallback(); 
          setAfterRegisterCallback(null); // 清空避免重複
        }

        // 顯示 SweetAlert2 提示框
        Swal.fire({
          icon: "success",
          text: "活動報名成功", // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });
        closeModal(setAfterRegisterCallback(null));
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
  console.log("data:", listData); // end Modal 報名

  // 回上一頁會記錄上次觀看點
  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      setCurrentPage(parseInt(savedPage, 10));
      sessionStorage.removeItem("currentPage"); // 用完就清掉
    }
  
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo({ top: parseInt(savedPosition, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

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
        </nav>
        <div className={`${Styles.advancedOptions}`}>
          {/* 篩選列 */}
          <div className={`${Styles.selectTop}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(searchInput);
              }}
            >
              <input
                type="text"
                placeholder="搜尋活動名稱、地點、主揪…"
                ref={searchRef}
                className={Styles.searchInput}
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </form>
            {isShow ? (
              <div onClick={clearSearch} className={Styles.X}>
                清除條件
              </div>
            ) : (
              ""
            )}
          </div>

          {/* 篩選列 */}
          <div className={Styles.selectTop}>
            <select
              id="people"
              name="people"
              value={sortType}
              className={Styles.selectType}
              onChange={(e) => {
                const value = e.target.value;
                setSortType(value);
                handleSortChange(value);
              }}
            >
              <option value="date">依照活動日期排序</option>
              <option value="location">依照地區排序</option>
              <option value="price">依照費用排序</option>
              <option value="people">依照報名人數排序</option>
            </select>
          </div>
        </div>
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
              currentPage={currentPage}
              registeredIds={registeredIds}
              onQuickSignUp={(activity, onRegisteredCallback) => {
                setActivityName(activity);
                setAfterRegisterCallback(() => onRegisteredCallback); // 存起報名成功後要執行的 callback
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
          <ul
            className={`pagination justify-content-center ${Styles.customPagination}`}
          >
            {/* ⏮️ 跳到第一頁 */}
            {currentPage !== 1 && (
              <li className="page-item">
                <button
                  className={`page-link ${Styles.pageButton}`}
                  onClick={() => handlePageChange(1)}
                >
                  <span className="icon-Left"></span>
                  <span className="icon-Left"></span>
                </button>
              </li>
            )}

            {/* « 上一頁 */}
            {currentPage !== 1 && (
              <li className="page-item">
                <button
                  className={`page-link ${Styles.pageButton}`}
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                >
                  <span className="icon-Left"></span>
                </button>
              </li>
            )}

            {/* 分頁數字 */}
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item`}>
                <button
                  className={`page-link ${Styles.pageButton} ${
                    currentPage === i + 1 ? Styles.activePage : ""
                  }`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            {/* » 下一頁 */}
            {currentPage !== totalPages && (
              <li className="page-item">
                <button
                  className={`page-link ${Styles.pageButton}`}
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                >
                  <span className="icon-Right"></span>
                </button>
              </li>
            )}

            {/* ⏭️ 跳到最後一頁 */}
            {currentPage !== totalPages && (
              <li className="page-item">
                <button
                  className={`page-link ${Styles.pageButton}`}
                  onClick={() => handlePageChange(totalPages)}
                >
                  <span className="icon-Right"></span>
                  <span className="icon-Right"></span>
                </button>
              </li>
            )}
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
                <div className={`${Styles.titleIcons} col-1`}>
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
                      value={selectedPeople}
                      onChange={(e) => setSelectedPeople(Number(e.target.value))}
                    >
                      {Array.from(
                        { length: Math.min(4, activityName?.need_num - activityName?.registered_people) },
                        (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} 人
                          </option>
                        )
                      )}
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
<ScrollToTopButton />

    </>
  );
}
