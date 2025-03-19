"use client";

import "bootstrap/dist/css/bootstrap.min.css"; // 引入 Bootstrap 樣式
import "bootstrap/dist/js/bootstrap.bundle.min"; // (選擇性) 引入 Bootstrap JS
import Link from "next/link";
import { useState, useEffect } from "react";
import Styles from "./create.module.css";
import "@/public/TeamB_Icon/style.css";
import "@/styles/globals.css";
// import { SPORT_TYPE_ITEM_GET } from "@/config/api-path";

export default function ActivityCreatePage() {
  const [hovered, setHovered] = useState(null); // 存儲目前 hover 的運動類別
  const [selected, setSelected] = useState(null); // 用來存儲點擊的選項

  const [sports, setSports] = useState([]); // 存 API 回傳的運動類別
  const [selectedSport, setSelectedSport] = useState(""); // 存當前點擊的運動類別
  const [images, setImages] = useState(Array(4).fill(null)); // 儲存 4 張圖片

  const [loading, setLoading] = useState(true); // 資料載入狀態
  const [error, setError] = useState(null); // 錯誤處理

  // 呼叫 API
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch(SPORT_TYPE_ITEM_GET);
        const data = await response.json();
        if (data.success) {
          setSports(data.rows); // 設定運動資料
        } else {
          throw new Error("無法取得資料");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  // 上傳圖片功能
  // TODO: 要修改可以上傳照片 (待修改)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files); // 取得多張圖片
    let newImages = [...images];

    // 限制最多只能 4 張
    // if (newImages.length + files.length > 4) {
    //   // TODO : 要改成Mo
    //   alert("最多只能上傳 4 張圖片！");
    //   return;
    // }

    for (let file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 找第一個 `null` 的位置填充圖片
        const emptyIndex = newImages.findIndex((img) => img === null);
        if (emptyIndex !== -1) {
          newImages[emptyIndex] = reader.result;
          setImages([...newImages]); // 更新圖片狀態
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={Styles.background}>
        {/* 選擇三項運動 */}
        <div className={Styles.sportIndex}>
          {/* 籃球圖片 */}
          <div
            className={
              selected === "basketball"
                ? Styles.basketballPhotoHover
                : hovered === "basketball"
                ? Styles.basketballPhotoHover
                : Styles.basketballPhoto
            }
          ></div>
          {/* 排球圖片 */}
          <div
            className={
              selected === "volleyball"
                ? Styles.volleyballPhotoHover
                : hovered === "volleyball"
                ? Styles.volleyballPhotoHover
                : Styles.volleyballPhoto
            }
          ></div>
          {/* 羽球圖片 */}
          <div
            className={
              selected === "shuttlecock"
                ? Styles.shuttlecockPhotoHover
                : hovered === "shuttlecock"
                ? Styles.shuttlecockPhotoHover
                : Styles.shuttlecockPhoto
            }
          ></div>
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
              onClick={() => {
                setSelected("basketball");
              }}
            >
              {/* 籃球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.basketball}`}>
                <div className={`icon-Basketball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>籃球</h3>
              </div>
            </a>
            {/* end 籃球選單 */}
            {/* 排球 選單 */}
            <Link
              href="#"
              className={`col ${Styles.select}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onMouseEnter={() => setHovered("volleyball")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected("volleyball");
              }}
            >
              {/* 排球 icon + 文字 */}
              <div className={`${Styles.sportType} ${Styles.volleyball}`}>
                <div className={`icon-Volleyball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>排球</h3>
              </div>
            </Link>
            {/* end 排球選單 */}
            {/* 羽球 選單 */}
            <Link
              href="#"
              className={`col ${Styles.select}`}
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              onMouseEnter={() => setHovered("shuttlecock")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected("shuttlecock");
              }}
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
              {selected === "basketball" ? (
                <h5
                  className={`modal-title ${Styles.inputTitle}`}
                  id="staticBackdropLabel"
                >
                  <span
                    className={`icon-Basketball ${Styles.modalIcon}`}
                  ></span>
                  建立籃球活動
                </h5>
              ) : selected === "volleyball" ? (
                <h5
                  className={`modal-title ${Styles.inputTitle}`}
                  id="staticBackdropLabel"
                >
                  <span
                    className={`icon-Volleyball ${Styles.modalIcon}`}
                  ></span>
                  建立排球活動
                </h5>
              ) : selected === "shuttlecock" ? (
                <h5
                  className={`modal-title ${Styles.inputTitle}`}
                  id="staticBackdropLabel"
                >
                  <span className={`icon-Badminton ${Styles.modalIcon}`}></span>
                  建立羽球活動
                </h5>
              ) : (
                "請選擇"
              )}
              <button
                type="button"
                className={`btn-close ${Styles.closeModal}`}
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelected("")}
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
              <select
                className={`${Styles.createInput}`}
                aria-label="Default select example"
              >
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
              <label htmlFor="note">活動詳情</label> <br />
              <textarea
                name="note"
                id="note"
                className={`${Styles.createInput}`}
                placeholder="本活動歡迎新手參加"
                defaultValue={""}
              />
              <br />
              {/* 上傳照片 */}
              <div className="row">
                <div className={`${Styles.titleImg}`}>
                  新增封面相片 (最多4張)
                </div>

                {/* 設定可以上傳照片的功能 */}
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput"
                  style={{ display: "none" }}
                  multiple // 允許多張
                  onChange={handleImageUpload}
                />

                {/* 顯示照片 */}
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${Styles.uploadImg} col`}
                    onMouseEnter={() => setHovered(`photo${index + 1}`)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      document.getElementById("imageInput").click();
                    }}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={`圖片 ${index + 1}`}
                        className={Styles.imagePreview}
                      />
                    ) : hovered === `photo${index + 1}` ? (
                      "請上傳圖片"
                    ) : (
                      "+"
                    )}
                  </button>
                ))}

              </div>
            </div>
            <div className={`modal-footer ${Styles.modalWidth}`}>
              <button
                type="button"
                className={`btn btn-secondary closeModal ${Styles.cancelBtn}`}
                data-bs-dismiss="modal"
                onClick={() => {
                  setSelected("");
                }}
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
