"use client";

import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 樣式
import "bootstrap/dist/js/bootstrap.bundle.min"; // (選擇性) 引入 Bootstrap JS
import Link from "next/link";
import { useState, useEffect } from "react";
import Styles from "./create.module.css";
import "@/public/TeamB_Icon/style.css";
import "@/styles/globals.css"


export default function ActivityCreatePage() {
  const [hovered, setHovered] = useState(null); // 存儲目前 hover 的運動類別
  // const [selected, setSelected] = useState(null); // 用來存儲點擊的選項
  return (
    <>
      <div className={Styles.background}>
        {/* 選擇三項運動 */}
        <div className={Styles.sportIndex}>
          {/* 籃球圖片 */}
          <div className={hovered ==="basketball" ? Styles.basketballPhotoHover : Styles.basketballPhoto} />
          {/* 排球圖片 */}
          <div className={hovered ==="volleyball" ? Styles.volleyballPhotoHover : Styles.volleyballPhoto} />
          {/* 羽球圖片 */}
          <div className={hovered ==="shuttlecock" ? Styles.shuttlecockPhotoHover : Styles.shuttlecockPhoto} />
          {/* 標題 */}
          <h1 className={Styles.title}>請選擇要開團的球局類別</h1>
          <div className={`${Styles.sport} row`}>
            {/* 籃球 選單 */}
            <a
              href="#"
              className={`col ${Styles.select}`}
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                onMouseEnter={() => setHovered("basketball")}
                onMouseLeave={() => setHovered(null)}
              // onClick={() => setSelected("basketball")}
            >
              {/* 籃球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.basketball}`}>
                <div className={`icon-Basketball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>籃球</h3>
              </div>
            </a>
            {/* end 籃球選單 */}
            {/* 排球 選單 */}
            <Link href="#" 
              className={`col ${Styles.select}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onMouseEnter={() => setHovered("volleyball")}
              onMouseLeave={() => setHovered(null)}
            >
              {/* 排球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.volleyball}`}>
                <div className={`icon-Volleyball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>排球</h3>
              </div>
            </Link>
            {/* end 排球選單 */}
            {/* 羽球 選單 */}
            <Link href="#" 
              className={`col ${Styles.select}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onMouseEnter={() => setHovered("shuttlecock")}
              onMouseLeave={() => setHovered(null)}
              >
              {/* 羽球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.shuttlecock}`}>
                <div className={`icon-Badminton ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>羽球</h3>
              </div>
            </Link>
            {/* end 羽球選單 */}
          </div>
        </div>
      </div>


       {/* Modal */}
  <div
    className={`modal fade`}
    id="staticBackdrop"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabIndex={-1}
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div className={`modal-dialog`}>
      <div className={`modal-content ${Styles.modalContent}`}>
        <div className={`modal-header ${Styles.modalWidth}`}>
          <h5 className={`modal-title ${Styles.inputTitle}`} id="staticBackdropLabel">
            <span className={`icon-Basketball`} />
            建立<span>籃球</span>活動
          </h5>
          <button
            type="button"
            className={`btn-close ${Styles.closeModal}`}
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className={`modal-body ${Styles.modalWidth}`}>
          <label htmlFor="activityName">活動名稱</label> <br />
          <input
            type="text"
            id="activityName"
            name="activityName"
            className={`${Styles.createInput}`}
            placeholder="活動名稱"
            required=""
          />
          <label htmlFor="address">活動地點</label> <br />
          <select className={`${Styles.createInput}`} aria-label="Default select example">
            <option selected="">--請選擇地區--</option>
            <option value={1}>東區</option>
            <option value={2}>南區</option>
            <option value={3}>永康區</option>
          </select>
          <input
            type="text"
            id="address"
            name="address"
            className={`${Styles.createInput}`}
            placeholder="球館 / 地點"
            required=""
          />
          <br />
          <label htmlFor="activityTime">活動時間</label> <br />
          <input
            type="datetime-local"
            id="activityTime"
            name="activityTime"
            className={`${Styles.createInput}`}
            required=""
          />
          <br />
          <label htmlFor="registerTime">報名截止期限</label> <br />
          <input
            type="datetime-local"
            id="registerTime"
            name="registerTime"
            className={`${Styles.createInput}`}
            required=""
          />
          <br />
          <label htmlFor="memberNumber">需求人數</label> <br />
          <input
            type="number"
            id="memberNumber"
            name="memberNumber"
            className={`${Styles.createInput}`}
            required=""
          />
          <br />
          <label htmlFor="price">費用(每人)</label> <br />
          <input
            type="number"
            id="price"
            name="price"
            className={`${Styles.createInput}`}
            required=""
          />
          <br />
          <div className="row">
            <div className={`${Styles.titleImg}`}>新增封面相片 (最多4張)</div>
            <div className={`${Styles.uploadImg} col`}>+</div>
            <div className={`${Styles.uploadImg} col`}>+</div>
            <div className={`${Styles.uploadImg} col`}>+</div>
            <div className={`${Styles.uploadImg} col`}>+</div>
          </div>
          <br />
          <textarea
            name="note"
            id="note"
            className={`${Styles.createInput}`}
            placeholder="備註： 本活動歡迎新手參加"
            defaultValue={""}
          />
        </div>
        <div className={`modal-footer ${Styles.modalWidth}`}>
          <button
            type="button"
            className={`btn btn-secondary closeModal ${Styles.cancelBtn}`}
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" className={`${Styles.okBtn} btn `}>
            確定建立
          </button>
        </div>
      </div>
    </div>
  </div>
    </>
  );
}
