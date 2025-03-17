"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ACTIVITY_LIST } from "@/config/api-path";
import Styles from "./activity-list.module.css";
import "@/public/TeamB_Icon/style.css";
import { useSearchParams } from "next/navigation";


export default function ActivityListPage() {
  const searchParams = useSearchParams();
  const searchRef = useRef();

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
        <Link href="#">
          <button className={`${Styles.create}`}>
            直接開團
          </button>
        </Link>
      </div>

      {/* 活動列表 */}
      <div className={`${Styles.container} mx-auto`}>
        <div className={`${Styles.list} row`}>
          {/* 圖案(用CSS背景) */}
          <div className={`${Styles.img} col-2`}>
            {/* 愛心按鈕 */}
            <span
              className={`icon-Like-Stroke ${Styles.iconLikeStroke}`}
            ></span>
          </div>
          <div className={`${Styles.information} col`}>
            <div className={`${Styles.title} row`}>
              <div className={`${Styles.titleIcons} col-1`}>
                <span
                  className={`icon-Badminton ${Styles.iconBadminton}`}
                ></span>
              </div>
              <h2 className={`${Styles.titleText} col`}>
                羽球運動-放假鳩團一起來
              </h2>
            </div>
            <div className={`${Styles.info}`}>
              <p>
                <span className={`${Styles.infoTitle}`}>地  點：</span>
                <span>台南市 南區 XXXXX 羽球館</span>
                <a
                  href="https://www.google.com/maps?authuser=0"
                  target="_blank"
                >
                  <i className="fa-solid fa-location-dot" />
                </a>
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>活動時間：</span>
                <span>2025年3月22日 18:30 - 20:30</span>
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>報名期限：</span>
                <span>2025年1月20日 00:00 - 2025年3月10日 23:59</span>
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>費  用：</span>每人 
                <span>150</span>
                 元
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>主  揪：</span>
                <span>Andy</span>
              </p>
            </div>
          </div>
          <div className="button col-2">
            <a href="./activity-detail.html">
              <button type="button" className={Styles.joinButton}>
                查看
                <br />
                詳情
              </button>
            </a>
            <button
              type="button"
              className={`${Styles.joinButton} ${Styles.joinInformation}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              快速報名
            </button>
            {/* <div class="memberButton">1/15人</div> */}
          </div>
        </div>
        <div className={`${Styles.list} row`}>
          {/* 圖案(用CSS背景) */}
          <div className={`${Styles.img} col-2`}>
            {/* 愛心按鈕 */}
            <span
              className={`icon-Like-Stroke ${Styles.iconLikeStroke}`}
            ></span>
          </div>
          {/* 活動資訊 */}
          <div className={`${Styles.information} col`}>
            <div className={`${Styles.title} row`}>
              <div className={`${Styles.titleIcons} col-1`}>
                <span
                  className={`icon-Badminton ${Styles.iconBadminton}`}
                ></span>
              </div>
              <h2 className={`${Styles.titleText} col`}>
                羽球運動-放假鳩團一起來
              </h2>
            </div>
            <div className={`${Styles.info}`}>
              <p>
                <span className={`${Styles.infoTitle}`}>地  點：</span>
                <span>台南市 南區 XXXXX 羽球館</span>
                <a
                  href="https://www.google.com/maps?authuser=0"
                  target="_blank"
                >
                  <i className="fa-solid fa-location-dot" />
                </a>
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>活動時間：</span>
                <span>2025年3月22日 18:30 - 20:30</span>
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>報名期限：</span>
                <span>2025年1月20日 00:00 - 2025年3月10日 23:59</span>
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>費  用：</span>每人 
                <span>150</span>
                 元
              </p>
              <p>
                <span className={`${Styles.infoTitle}`}>主  揪：</span>
                <span>Andy</span>
              </p>
            </div>
          </div>
          {/* BTN按鈕 */}
          <div className="button col-2">
            <a href="./activity-detail.html">
              <button type="button" className={Styles.joinButton}>
                查看
                <br />
                詳情
              </button>
            </a>
            <button
              type="button"
              className={`${Styles.joinButton} ${Styles.joinInformation}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              快速報名
            </button>
            {/* <div class="memberButton">1/15人</div> */}
          </div>
        </div>

        {/* 分頁按鈕 */}
        <div className="containerPage">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="pageItem">
                <a
                  className="page-link pageLink"
                  href="#"
                  aria-label="Previous"
                >
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
                  <span
                    className={`icon-Badminton ${Styles.iconBadminton}`}
                  ></span>
                </div>
                <h2 className={`${Styles.titleText} col`}>
                  羽球運動-放假鳩團一起來
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
                    defaultValue="報名費用: 總計 150 元"
                    disabled="true"
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
