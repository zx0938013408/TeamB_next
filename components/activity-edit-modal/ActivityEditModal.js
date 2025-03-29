"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import Styles from "@/app/activity-create/create.module.css"; // 您可以為這個 modal 加上自己的樣式
import CourtList from "../court-info/court_info";
import AreaSelector from "../city-area/area";
import StylesCity from "@/styles/city-area/city-area.module.css";
import { AVATAR_PATH } from "@/config/api-path";
import { CITY_LIST } from "@/config/cityArea-api-path";

const ActivityEditModal = ({ showModal, activity, onClose, onSave }) => {
  const { auth } = useAuth();
  const [selectedArea, setSelectedArea] = useState("");
  const [cityData, setCityData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [courtList, setCourtList] = useState([]); // 全部場地資料
  const [images, setImages] = useState(Array(4).fill(null));
  const imageInputRef = useRef([]);
  const inputRef = useRef([]);
  const selectedCity = "14"; // 固定台南市
  const [formData, setFormData] = useState({
    activity_name: activity?.activity_name || "",
    sport_name: activity?.sport_name || "",
    activity_time: activity?.activity_time || "",
    deadline: activity?.deadline || "",
    payment: activity?.payment || "",
    need_num: activity?.need_num || "",
    introduction: activity?.introduction || "",
    area_id: activity?.area_id || "",
    court_id: activity?.court_id || "",
    avatar: activity?.avatar || "",
    avatar2: activity?.avatar2 || "",
    avatar3: activity?.avatar3 || "",
    avatar4: activity?.avatar4 || "",
    sport_type_id: activity?.sport_type_id || selectedSport,
    founder_id: auth.id,
  });

  // 按取消 || X 會清空資料
  const resetForm = () => {
    setFormData({
      activity_name: "",
      sport_type_id: "",
      area_id: "",
      court_id: "",
      activity_time: "",
      deadline: "",
      payment: "",
      need_num: "",
      introduction: "",
      address: "",
    });
    setSelected("");
    setSelectedSport(null);
    setSelectedArea("");
    setImages(Array(4).fill(null)); // ✅ 清空所有圖片 & 預覽

    // 清空檔案 input 的內容（實體 DOM input）
    inputRef.current.forEach((input) => {
      if (input && input.type !== "file") {
        input.value = "";
      } else if (input && input.type === "file") {
        input.value = null; // 清空檔案選擇
      }
    });
  };

  // 計算明天日期（格式：YYYY-MM-DDTHH:MM）
  const getTomorrowDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1); // +1天
    now.setHours(0, 0, 0, 0); // 從凌晨 00:00 開始
    return formatDateTimeLocal(now); // YYYY-MM-DDTHH:mm 格式
  };
  // 修改為該地區時間
  const formatDateTimeLocal = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  // 設定最遲截止日 (活動前3小時)
  const getDeadlineMaxTime = () => {
    if (!formData.activity_time) return undefined;
    const activityTime = new Date(formData.activity_time);
    activityTime.setHours(activityTime.getHours() - 3);
    return formatDateTimeLocal(activityTime);
  };

  // 照片上傳功能
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    let newImages = [...images];

    for (let file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const emptyIndex = newImages.findIndex((img) => img === null);
        if (emptyIndex !== -1) {
          newImages[emptyIndex] = {
            file,
            preview: reader.result,
          };
          setImages([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 載入區域資料
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const res = await fetch(CITY_LIST); // 替換成你的 API 路徑
        const data = await res.json();

        if (data.success) {
          // ✅ 只保留台南市 (city_id === 14)
          const filtered = data.rows.filter(
            (item) => Number(item.city_id) === 14
          );
          setCityData(filtered);
        }
      } catch (err) {
        console.error("❌ 載入城市資料失敗：", err);
      }
    };

    fetchCityData();
  }, []);

  useEffect(() => {
    if (showModal && activity) {
      setFormData({
        activity_name: activity.activity_name || "",
        sport_name: activity.sport_name || "",
        activity_time: activity.activity_time || "",
        deadline: activity.deadline || "",
        payment: activity.payment || "",
        need_num: activity.need_num || "",
        introduction: activity.introduction || "",
        area_id: activity.area_id || "",
        court_id: activity.court_id || "",
        address: activity.address || "",
        avatar: activity.avatar || "",
        avatar2: activity.avatar2 || "",
        avatar3: activity.avatar3 || "",
        avatar4: activity.avatar4 || "",
        sport_type_id: activity.sport_type_id || selectedSport,
        founder_id: auth.id,
      });
      // 圖示與選項初始化
      if (activity.sport_name === "籃球") setSelected("basketball");
      else if (activity.sport_name === "排球") setSelected("volleyball");
      else if (activity.sport_name === "羽球") setSelected("shuttlecock");

      setSelectedSport(activity.sport_type_id || null);
      setSelectedArea(activity.area_id || "");

      // 設定圖片預覽
      const avatars = [
        activity?.avatar,
        activity?.avatar2,
        activity?.avatar3,
        activity?.avatar4,
      ];
      const newImages = avatars.map((avatar) =>
        avatar
          ? {
              file: null,
              preview: `${AVATAR_PATH}${avatar}`,
            }
          : null
      );
      setImages(newImages);
    }
  }, [showModal, activity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    formData.al_id = activity.al_id;
    const updatedFormData = { ...formData };

    images.forEach((img, idx) => {
      if (img && img.file) {
        updatedFormData[`avatar${idx === 0 ? "" : idx + 1}`] = img.file;
      } else if (img && typeof img.url === "string") {
      }
    });

    onSave(updatedFormData);
  };

  return (
    <>
      {showModal && <div className="modal-backdrop fade show"></div>}
      <div
        className={`modal ${showModal ? "show d-block" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        tabIndex="-1"
      >
        {" "}
        <div className="modal-dialog">
          <div className={`modal-content ${Styles.modalContent}`}>
            <div className={`modal-header ${Styles.modalWidth}`}>
              <h5
                className={`modal-title ${Styles.inputTitle}`}
                id="staticBackdropLabel"
              >
                {selected && (
                  <span
                    className={`icon-${
                      selected.charAt(0).toUpperCase() + selected.slice(1)
                    } ${Styles.modalIcon}`}
                  ></span>
                )}
                修改
                {selected
                  ? selected === "basketball"
                    ? "籃球"
                    : selected === "volleyball"
                    ? "排球"
                    : "羽球"
                  : ""}
                活動
              </h5>
              <button
                type="button"
                className={`btn-close ${Styles.closeModal}`}
                aria-label="Close"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              />
            </div>
            <div className={`modal-body ${Styles.modalWidth}`}>
              <label>活動名稱</label>
              <input
                type="text"
                name="activity_name"
                value={formData.activity_name}
                className={Styles.createInput}
                onChange={handleInputChange}
              />
              <label>活動詳情</label>
              <div className={Styles.createInput}>
                <textarea
                  name="introduction"
                  className={Styles.createTextarea}
                  ref={(el) => (inputRef.current[7] = el)}
                  placeholder="請輸入活動相關資訊"
                  onChange={handleInputChange}
                  value={formData.introduction}
                ></textarea>
                {/* 選擇照片 */}
                <div className="row">
                  <div className={Styles.titleImg}>新增封面相片 (最多4張)</div>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    multiple
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                  />
                  {images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`${Styles.uploadImg} col`}
                      onMouseEnter={() => setHovered(`photo${index + 1}`)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() =>
                        imageInputRef.current && imageInputRef.current.click()
                      }
                    >
                      {image ? (
                        <img
                          src={image.preview}
                          alt={`圖片 ${index + 1}`}
                          className={Styles.imagePreview}
                          onClick={() => {
                            const updated = [...images];
                            updated[index] = null;
                            setImages(updated);
                          }}
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

              <label>活動地點</label>
              {/* 後續可引入縣市選擇功能 */}
              <div className={`row ${Styles.areaCourt}`}>
                <div
                  className={`${Styles.createInput} ${Styles.createInputDistance}`}
                >
                  <span className={`${Styles.distance}`}>
                    <select className={StylesCity.border} disabled>
                      <option value="14">台南市</option>
                    </select>
                  </span>
                  <span
                    ref={(el) => (inputRef.current[1] = el)}
                    className={`${Styles.distance}`}
                  >
                    <span className={`${Styles.line}`}>|</span>
                    {selectedSport && (
                      <AreaSelector
                        selectedCity={selectedCity}
                        selectedArea={selectedArea}
                        setSelectedArea={setSelectedArea}
                        cityData={cityData}
                        selectedSport={selectedSport} // ✅ 傳入目前球種
                        courtList={courtList} // ✅ 傳入場地清單
                        handleInputChange={handleInputChange}
                      />
                    )}
                  </span>
                  <span
                    ref={(el) => (inputRef.current[2] = el)}
                    className={Styles.court}
                  >
                    <span className={`${Styles.line}`}>|</span>
                    <CourtList
                      selectedCity={selectedCity}
                      selectedArea={selectedArea}
                      selectedSport={selectedSport}
                      selectedCourtId={formData.court_id}
                      onSelectCourt={(courtId, courtData) => {
                        setFormData((prev) => ({
                          ...prev,
                          court_id: courtId,
                          address: courtData?.address || "", // 這樣就能一併存地址
                        }));
                      }}
                      handleInputChange={handleInputChange}
                    />
                  </span>
                </div>
              </div>
              <div className={`row`}>
                <span className={`col`}>
                  <label>活動時間</label>
                  <input
                    type="datetime-local"
                    name="activity_time"
                    value={formData.activity_time}
                    className={Styles.createInput}
                    min={getTomorrowDateTime()}
                    ref={(el) => (inputRef.current[3] = el)}
                    onChange={handleInputChange}
                    disabled
                  />

                  {/* 預設在活動日期前一天23:59, 最晚只能設定活動時間前3小時 */}
                </span>
                <span className={`col`}>
                  <label>報名截止期限</label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    className={Styles.createInput}
                    value={formData.deadline || ""}
                    min={formatDateTimeLocal(new Date())}
                    max={getDeadlineMaxTime()}
                    disabled={!formData.activity_time}
                    ref={(el) => (inputRef.current[4] = el)}
                    onChange={handleInputChange}
                  />
                </span>
              </div>
              <div className={`row`}>
                <span className={`col`}>
                  <label>需求人數</label>
                  <input
                    type="number"
                    name="need_num"
                    value={formData.need_num}
                    className={Styles.createInput}
                    ref={(el) => (inputRef.current[5] = el)}
                    min="0"
                    onChange={handleInputChange}
                  />
                </span>
                <span className={`col`}>
                  <label>費用(每人)</label>
                  <input
                    type="number"
                    name="payment"
                    value={formData.payment}
                    className={Styles.createInput}
                    min="0"
                    ref={(el) => (inputRef.current[6] = el)}
                    onChange={handleInputChange}
                  />
                </span>
              </div>
            </div>
            <div className={`modal-footer ${Styles.modalWidth}`}>
              <button
                type="button"
                className={`btn btn-secondary closeModal ${Styles.cancelBtn}`}
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              >
                取消
              </button>
              <button
                type="button"
                className={`${Styles.okBtn} btn`}
                onClick={handleSubmit}
              >
                確定修改
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityEditModal;
