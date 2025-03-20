"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Styles from "./activity-list.module.css";
import "@/public/TeamB_Icon/style.css";
import { useRouter, useSearchParams } from "next/navigation";
import { AL_LIST } from "@/config/api-path";
import ActivityCard from "@/components/activity-list-card/ActivityCard";

export default function ActivityListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchRef = useRef();
  // const { auth, getAuthHeader } = useAuth();

  const [refresh, setRefresh] = useState(false);
  const [listData, setListData] = useState([]);
  const [activityName, setActivityName] = useState(null);
  const [selectedPeople, setSelectedPeople] = useState(1);

  // const deleteItem = async (ab_id) => {
  //   const r = await fetch(`${AB_DELETE}/${ab_id}`, {
  //     method: "DELETE",
  //   });
  //   const result = await r.json();
  //   console.log(result);
  //   if (result.success) {
  //     setRefresh((o) => !o);
  //   }
  // };
  // const toggleLike = (ab_id) => {
  //   fetch(`${TOGGLE_LIKE}/${ab_id}`, {
  //     headers: { ...getAuthHeader() },
  //   })
  //     .then((r) => r.json())
  //     .then((result) => {
  //       console.log(result);
  //       if (result.success) {
  //         // setRefresh(! refresh); // 讓頁面重新抓資料

  //         // 另一種作法, 直接變更頁面資料的狀態
  //         const newListData = structuredClone(listData);
  //         newListData.rows.forEach((r) => {
  //           if (r.ab_id == result.ab_id) {
  //             r.like_id = result.action == "add" ? true : false;
  //           }
  //         });
  //         setListData(newListData);
  //       }
  //     });
  // };

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

  //   fetch(`${AL_LIST}`, { signal })
  //     .then((r) => r.json())
  //     .then((obj) => {
  //       console.log("API 回傳資料：", obj);
  //       if (obj.success) {
  //         setListData({...obj});
  //       }
  //     })
  //     .catch(console.warn);

  //   return () => {
  //     controller.abort();
  //   };
  // }, [searchParams, refresh]);

  // console.log('data:',listData);

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
            <select id="people" name="people">
              <option value={1}>依照活動日期排序</option>
              <option value={2}>依照地區排序</option>
              <option value={3}>依照費用排序</option>
              <option value={4}>依照報名人數排序</option>
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

      {/* Mobal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
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
                  <span className={`icon-Badminton ${Styles.iconTitle}`}></span>
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
                    defaultValue={`報名費用: 總計 ${activityName?.payment ? activityName?.payment * selectedPeople : 0} 元`}
                    disabled
                  />
                  <textarea
                    className={`${Styles.textareaInput}`}
                    name=""
                    id=""
                    placeholder="備註:ex 3男2女 (填)"
                    defaultValue={""}
                  />
                  <div className="modal-footer">
                    <button
                      type="button"
                      className={Styles.cancel}
                      data-bs-dismiss="modal"
                    >
                      取消
                    </button>
                    <button type="button" className={Styles.register}>
                      確定報名
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
