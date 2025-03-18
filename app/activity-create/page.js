"use client";

import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 樣式
import "bootstrap/dist/js/bootstrap.bundle.min"; // (選擇性) 引入 Bootstrap JS
import Link from "next/link";
import { useState, useEffect } from "react";
import Styles from "./create.module.css";

export default function ActivityCreatePage() {
  return (
    <>
      <div className={Styles.background}>
        {/* 選擇三項運動 */}
        <div className={Styles.sportIndex}>
          {/* 籃球圖片 */}
          <div className={Styles.basketballPhoto} />
          {/* 排球圖片 */}
          <div className={Styles.volleyballPhoto} />
          {/* 羽球圖片 */}
          <div className={Styles.shuttlecockPhoto} />
          {/* 標題 */}
          <h1 className={Styles.title}>請選擇要開團的球局類別</h1>
          <div className={`${Styles.sport} row`}>
            {/* 籃球 選單 */}
            <Link
              href="#"
              className={`col ${Styles.toLink}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              {/* 籃球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.basketball}`}>
                {/* <img
                  className="sportIcon"
                  src="/public/photo/activity-basketballCourt.jpg"
                  alt=""
                /> */}
                <h3 className={Styles.sportTitle}>籃球</h3>
              </div>
            </Link>
            {/* end 籃球選單 */}
            {/* 排球 選單 */}
            <Link href="#" className={`col ${Styles.toLink}`}>
              {/* 排球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.volleyball}`}>
                {/* <img
                  className="sportIcon"
                  src="../public/icon/icon-volleyball.png"
                  alt=""
                /> */}
                <h3 className={Styles.sportTitle}>排球</h3>
              </div>
            </Link>
            {/* end 排球選單 */}
            {/* 羽球 選單 */}
            <Link href="#" className={`col ${Styles.toLink}`}>
              {/* 羽球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.shuttlecock}`}>
                {/* <img
                  className="sportIcon"
                  src="../public/icon/icon-badminton.png"
                  alt=""
                /> */}
                <h3 className={Styles.sportTitle}>羽球</h3>
              </div>
            </Link>
            {/* end 羽球選單 */}
          </div>
        </div>
      </div>
    </>
  );
}
