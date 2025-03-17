"use client";

import Link from "next/link";
import { useRef, useState } from "react";
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

        {/* 開團按鈕 */}
        <Link href="#">
          <button className={Styles.create}>直接開團</button>
        </Link>
      </div>

      {/* 活動列表 */}
      <div className={`${Styles.container} mx-auto`}>
        <div className="list row">
          <div className={`${Styles.img} col-2`}>
            <span className={`icon-Like-Stroke ${Styles.heart}`}></span>
          </div>
          <div className="information col">
            <div className="title row">
              <div className="titleIcons col-1">
                <span
                  className={`icon-Badminton ${Styles.iconBadminton}`}
                ></span>
              </div>
              <h2 className="titleText col">羽球運動-放假鳩團一起來</h2>
            </div>
            <div className="info">
              <p>
                <span className="infoTitle">地  點：</span>
                <span>台南市 南區 XXXXX 羽球館</span>
                <a
                  href="https://www.google.com/maps?authuser=0"
                  target="_blank"
                >
                  <i className="fa-solid fa-location-dot" />
                </a>
              </p>
              <p>
                <span className="infoTitle">活動時間：</span>
                <span>2025年3月22日 18:30 - 20:30</span>
              </p>
              <p>
                <span className="infoTitle">報名期限：</span>
                <span>2025年1月20日 00:00 - 2025年3月10日 23:59</span>
              </p>
              <p>
                <span className="infoTitle">費  用：</span>每人 <span>150</span>
                 元
              </p>
              <p>
                <span className="infoTitle">主  揪：</span>
                <span>Andy</span>
              </p>
            </div>
          </div>
          <div className="button col-2">
            <a href="./activity-detail.html">
              <button type="button" className="joinButton">
                查看
                <br />
                詳情
              </button>
            </a>
            <button
              type="button"
              className="joinButton joinInformation"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              快速報名
            </button>
            {/* <div class="memberButton">1/15人</div> */}
          </div>
        </div>
      </div>
    </>
  );
}
