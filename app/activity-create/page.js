"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Styles from "./create.module.css";
import styles from "@/styles/Header.module.css";
import StylesCity from "@/styles/city-area/city-area.module.css";
import "@/public/TeamB_Icon/style.css";
import "@/styles/globals.css";
import { AL_CREATE_POST } from "@/config/api-path";
import { AVATAR_PATH } from "@/config/auth.api";
import { ACTIVITY_ADD_POST } from "@/config/activity-registered-api-path";
import { CITY_LIST } from "@/config/cityArea-api-path";
import AreaSelector from "@/components/city-area/area";
import CourtList from "@/components/court-info/court_info"
import { useAuth } from "@/context/auth-context"; // 引入 useAuth
import { toast } from "react-toastify";  // 引入 react-toastify
import "react-toastify/dist/ReactToastify.css";  // 引入 CSS
import Swal from "sweetalert2"; // 引入 SweetAlert2
import Header from "@/components/Header";



export default function ActivityCreatePage() {
  const pathname = usePathname();
  const { auth, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [selectedCity, setSelectedCity] = useState("14");
  const [selectedArea, setSelectedArea] = useState("");
  const [cityData, setCityData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [courtList, setCourtList] = useState([]); // 全部場地資料
  const [images, setImages] = useState(Array(4).fill(null));
  const imageInputRef = useRef([]);
  const inputRef = useRef([]);
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const [formData, setFormData] = useState({
    activity_name: "",
    sport_type_id: "",
    area_id: "",
    court_id : "",
    activity_time: "",
    deadline: "",
    payment: "",
    need_num: "",
    introduction: "",
    address: "",
  });

  // 登出功能
  const handleLogout = () => {
      // 紀錄當前頁面 URL
      localStorage.setItem("lastPageBeforeLogout", router.asPath);
  
      logout();
  
      // 顯示登出提示
      toast("會員已登出",{
        position:"top-center" , // 設定通知顯示位置
        autoClose:2000   ,   
        hideProgressBar:true ,// 隱藏進度
      });
  
      if (pathname && pathname.startsWith("/auth/member")) {
        router.push("/");
      }
  
    };

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
          const filtered = data.rows.filter(item => Number(item.city_id) === 14);
          setCityData(filtered);
        }
      } catch (err) {
        console.error("❌ 載入城市資料失敗：", err);
      }
    };
  
    fetchCityData();
  }, []);

  const selectedCity = "14"; // 固定台南市
  
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


  // ✅ 當使用者輸入活動時間，自動設定截止日為「活動前一天的 23:59」
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "activity_time") {
      const activityTime = new Date(value);
      const deadline = new Date(activityTime);
      deadline.setDate(deadline.getDate() - 1); // 前一天
      deadline.setHours(23, 59, 0, 0); // 晚上 11:59
  
      const deadlineFormatted = formatDateTimeLocal(deadline);
  
      setFormData((prev) => ({
        ...prev,
        activity_time: value,
        deadline: deadlineFormatted,
        sport_type_id: selectedSport,
        founder_id: auth.id,
      }));
      return;
    }

     // 處理報名截止時間：限制不能超過活動時間前 3 小時
  if (name === "deadline") {
    const selected = new Date(value);
    const activity = new Date(formData.activity_time);

    // 檢查是否有活動時間
    if (formData.activity_time) {
      const maxDeadline = new Date(activity.getTime() - 3 * 60 * 60 * 1000); // 活動時間 -3hr

      if (selected > maxDeadline) {

        // 顯示 SweetAlert2 提示框
        Swal.fire({
          icon: "warning",
          text: "截止時間不可晚於活動時間的3小時前，已自動調整！",  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });

        setFormData((prev) => ({
          ...prev,
          deadline: formatDateTimeLocal(maxDeadline),
        }));
        return;
      }
    }
    // 正常情況更新 deadline
    setFormData((prev) => ({
      ...prev,
      deadline: value,
      sport_type_id: selectedSport,
      founder_id: auth.id,
    }));
    return;
  }

  
    // 其他欄位照常處理
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      sport_type_id: selectedSport,
      founder_id: auth.id,
    }));
  };

    // 計算明天日期（格式：YYYY-MM-DDTHH:MM）
    const getTomorrowDateTime = () => {
      const now = new Date();
      now.setDate(now.getDate() + 1); // +1天
      now.setHours(0, 0, 0, 0); // 從凌晨 00:00 開始
      return formatDateTimeLocal(now); // YYYY-MM-DDTHH:mm 格式
    };

    // 設定最遲截止日 (活動前3小時)
    const getDeadlineMaxTime = () => {
      if (!formData.activity_time) return undefined;
      const activityTime = new Date(formData.activity_time);
      activityTime.setHours(activityTime.getHours() - 3);
      return formatDateTimeLocal(activityTime);
    };


  // 打開Modal
  useEffect(() => {
    if (typeof window !== "undefined" && modalRef.current) {
      const bootstrap = require("bootstrap");
      const modalInstance = new bootstrap.Modal(modalRef.current);
      bsModal.current = modalInstance;
  
      // ✅ 加入 event listener 等 Modal 完全開啟後觸發 resize
      const handleShown = () => {
        window.dispatchEvent(new Event("resize"));
      };
      modalRef.current.addEventListener("shown.bs.modal", handleShown);
  
      // ✅ 清除事件監聽（避免記憶體外洩）
      return () => {
        modalRef.current?.removeEventListener("shown.bs.modal", handleShown);
      };
    }
  }, []);

    // 等 selectedSport 設定好後才開啟 Modal（關鍵！）
    useEffect(() => {
      if (selectedSport) {
        openModal();
      }
    }, [selectedSport]);

  const openModal = () => {
    if (bsModal.current) bsModal.current.show();
  };

  const closeModal = () => {
    if (bsModal.current) bsModal.current.hide();
  };
  

  // 活動送出功能
  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((imgObj, i) => {
      if (imgObj && imgObj.file) {
        data.append(`avatar${i === 0 ? "" : i + 1}`, imgObj.file);
      }
    });

    try {
      const response = await fetch(AL_CREATE_POST, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        const al_id = result.result.insertId;
        // 顯示 SweetAlert2 提示框
        Swal.fire({
          icon: "success",
          text: "活動建立成功！",  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });

        // ✅ 新增：自動報名自己 1 人
        try {
        const resRegister = await fetch(ACTIVITY_ADD_POST, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            member_id: auth.id,
            activity_id: al_id,
            num: 1,
            notes: "我是團主",
          }),
        });

          const registerResult = await resRegister.json();
          if (!registerResult.success) {
            console.warn("自動報名失敗：", registerResult);
          }
        } catch (regErr) {
          console.error("自動報名時發生錯誤：", regErr);
        }

        // 先關閉 Modal
        closeModal();
        setSelected("")
        
        // 延遲導向，避免 Modal 遮罩殘留
        setTimeout(() => {
          router.push(`/activity-list/${al_id}`);
        }, 400); // Bootstrap Modal 動畫大約 300ms

      } else {
        // 顯示 SweetAlert2 提示框
        Swal.fire({
          icon: "error",
          text: "建立失敗：" + (result.error?.issues?.[0]?.message || "未知錯誤"),  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });
        console.error();
      }
    } catch (err) {
      console.error("發生錯誤:", err);
      // 顯示 SweetAlert2 提示框
      Swal.fire({
        icon: "error",
        text: "發生錯誤，請稍後再試。",  // 顯示後端回傳的訊息
        confirmButtonText: "確定",
        confirmButtonColor: "#29755D", // 修改按鈕顏色
        didClose: () =>{
          document.body.style.overflow = ''
        },
      });
    }
  };


  return (
    <>
    <div className={Styles.header}>
      <Header />
    </div>
      <div className={Styles.background}>
        {/* 選擇三項運動 */}
        <div className={Styles.sportIndex}>
          {/* 籃球圖片 */}
          <div className={selected === "basketball" || hovered === "basketball" ? Styles.basketballPhotoHover : Styles.basketballPhoto}></div>
          {/* 排球圖片 */}
          <div className={selected === "volleyball" || hovered === "volleyball" ? Styles.volleyballPhotoHover : Styles.volleyballPhoto}></div>
          {/* 羽球圖片 */}
          <div className={selected === "shuttlecock" || hovered === "shuttlecock" ? Styles.shuttlecockPhotoHover : Styles.shuttlecockPhoto}></div>
          <h1 className={Styles.title}>請選擇要開團的球局類別</h1>
          <button 
            className={Styles.goBack} 
            onClick={() => {
              if (window.history.length > 2) {
                router.back();
              } else {
                router.push("/"); // 或任何你希望導去的 fallback 頁面
              }
            }}
          >
            <Image src="/photo/logo/TeamB-logo-whiteYellow.png" alt="TeamB Logo" width={20} height={20} /> 回上一頁
          </button>

          {/* 會員頁面 */}
          {auth.id != 0 ? (
            <div className={Styles.avatarWrapper}>
              <img
                 src={auth?.avatar ? `${AVATAR_PATH}/${auth.avatar}`: `${AVATAR_PATH}/imgs.png`}
                alt="User Avatar"
                className={Styles.avatarImg}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <ul className={Styles.dropdownMenu}>
                  <li onClick={() => router.push("/auth/member")}>會員中心</li>
                  <li onClick={() => router.push("/auth/member-edit")}>編輯個人檔案</li>
                  <li onClick={() => router.push("/auth/member-account")}>帳號管理</li>
                  <li onClick={() => router.push("/auth/orderHistory")}>我的訂單</li>
                  <li onClick={() => router.push("/auth/member-likes")}>收藏商品</li>
                  <li onClick={handleLogout}>登出</li>
                </ul>
              )}
            </div>
          ) : (
            <button
              className={Styles.user}
              onClick={() => {
                 // ✅ 登入前紀錄當前頁
                localStorage.setItem("lastVisitedPage", window.location.pathname);
                router.push("/auth/login");
              }}
            >
              登入
            </button>
          )}


          <div 
            className={`${Styles.sport} row`}
            onClick={()=>{
              if (!auth?.id) {
                // 顯示 SweetAlert2 提示框
                Swal.fire({
                  icon: "warning",
                  text: "請先登入",  // 顯示後端回傳的訊息
                  confirmButtonText: "確定",
                  confirmButtonColor: "#29755D", // 修改按鈕顏色
                  timer: 1300, // 顯示 1.3 秒後自動關閉
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  didClose: () => {
                    document.body.style.overflow = ''
                    window.location.href = "/auth/login"; // 或用 router.push
                  }
                });
                return;
              }
            }}
          >
            <div className={`col-md ${Styles.select}`} onMouseEnter={() => setHovered("basketball")} onMouseLeave={() => setHovered(null)} 
            onClick={() => {
              setSelected("basketball")
              setSelectedSport(1)
              }}>
              <div className={`${Styles.sportType} ${Styles.basketball}`}>
                <div className={`icon-Basketball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>籃球</h3>
              </div>
            </div>
            <div className={`col-md ${Styles.select}`} onMouseEnter={() => setHovered("volleyball")} onMouseLeave={() => setHovered(null)} 
            onClick={() => {
              setSelected("volleyball")
              setSelectedSport(2)
            }}>
              <div className={`${Styles.sportType} ${Styles.volleyball}`}>
                <div className={`icon-Volleyball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>排球</h3>
              </div>
            </div>
            <div className={`col-md ${Styles.select}`} onMouseEnter={() => setHovered("shuttlecock")} onMouseLeave={() => setHovered(null)} 
            onClick={() => {
              setSelected("shuttlecock")
              setSelectedSport(3)
              }}>
              <div className={`${Styles.sportType} ${Styles.shuttlecock}`}>
                <div className={`icon-Badminton ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>羽球</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div 
      className="modal fade" 
      id="staticBackdrop" 
      data-bs-backdrop="static" 
      data-bs-keyboard="false" 
      tabIndex={-1} 
      ref={modalRef}
      aria-labelledby="staticBackdropLabel" 
      aria-hidden="true">
        <div className="modal-dialog">
          <div className={`modal-content ${Styles.modalContent}`}>
            <div className={`modal-header ${Styles.modalWidth}`}>
              <h5 className={`modal-title ${Styles.inputTitle}`} id="staticBackdropLabel">
                {selected && <span className={`${
                    selected === "shuttlecock"
                      ? "icon-Badminton"
                      : `icon-${selected.charAt(0).toUpperCase() + selected.slice(1)}`
                  } ${Styles.modalIcon}`}></span>}
                建立{selected ? (selected === "basketball" ? "籃球" : selected === "volleyball" ? "排球" : selected === "shuttlecock" ?  "羽球" : "") : ""}活動
              </h5>
              <button type="button" className={`btn-close ${Styles.closeModal}`} data-bs-dismiss="modal" aria-label="Close" onClick={resetForm} />
            </div>
            <div className={`modal-body ${Styles.modalWidth}`}>

              <label>活動名稱</label>
              <input type="text" name="activity_name" ref={(el) => (inputRef.current[0] = el)} className={Styles.createInput} onChange={handleInputChange} />

              <label>活動詳情</label>
              <div className={Styles.createInput}>
              <textarea name="introduction" className={Styles.createTextarea} ref={(el) => (inputRef.current[7] = el)} placeholder="請輸入活動相關資訊" onChange={handleInputChange}></textarea>
              {/* 選擇照片 */}
              <div className="row">
                <div className={Styles.titleImg}>新增封面相片 (最多4張)</div>
                <input 
                type="file" 
                accept="image/*"
                style={{ display: "none" }} 
                multiple
                ref={imageInputRef}
                onChange={handleImageUpload} />
                {images.map((image, index) => (
                  <button 
                  key={index} 
                  type="button" 
                  className={`${Styles.uploadImg} col`} 
                  onMouseEnter={() => setHovered(`photo${index + 1}`)} 
                  onMouseLeave={() => setHovered(null)} onClick={() => imageInputRef.current && imageInputRef.current.click()}>
                    {image ? <img src={image.preview} alt={`圖片 ${index + 1}`} className={Styles.imagePreview} /> : hovered === `photo${index + 1}` ? "請上傳圖片" : "+"}
                  </button>
                ))}
              </div>
              </div>


              <label>活動地點</label>
              {/* 後續可引入縣市選擇功能 */}
              <div className={`row ${Styles.areaCourt}`}>
              <div className={`${Styles.createInput} ${Styles.createInputDistance}`} >
              <span className={`${Styles.distance}`}>
              <select className={StylesCity.border} disabled>
              <option value="14">台南市</option>
            </select>
              </span>
              <span ref={(el) => (inputRef.current[1] = el)} className={`${Styles.distance}`}>
              <span className={`${Styles.line}`}>|</span>
              {selectedSport && (
                <AreaSelector
                  selectedCity={selectedCity}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                  cityData={cityData}
                  selectedSport={selectedSport} // ✅ 傳入目前球種
                  courtList={courtList}         // ✅ 傳入場地清單
                  handleInputChange={handleInputChange}
                />
              )}
              </span>
              <span ref={(el) => (inputRef.current[2] = el)} className={Styles.court} >
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
              {/* <input type="text" name="court_id" className={Styles.createInput} placeholder="球館 / 地點" onChange={handleInputChange} /> */}
              <div className={`row`}>
              <span className={`col`}>
              <label>活動時間</label>
              <input 
                type="datetime-local" 
                name="activity_time" 
                className={Styles.createInput} 
                min={getTomorrowDateTime()} 
                ref={(el) => (inputRef.current[3] = el)}
                onChange={handleInputChange} />

              {/* 預設在活動日期前一天23:59, 最晚只能設定活動時間前3小時 */}
              </span>
              <span  className={`col`}>
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
                onChange={handleInputChange} />
              </span>
              </div>

              <div className={`row`}>
              <span className={`col-6`}>
              <label>需求人數</label>
              <input type="number" name="need_num" className={Styles.createInput} ref={(el) => (inputRef.current[5] = el)} min="0" onChange={handleInputChange} />
              </span>
              <span className={`col-6`}>
              <label>費用(每人)</label>
              <input type="number" name="payment" className={Styles.createInput} min="0" ref={(el) => (inputRef.current[6] = el)}  onChange={handleInputChange} value={0} />
              </span>
              </div>

            </div>
            <div className={`modal-footer ${Styles.modalWidth}`}>
              <button type="button" className={`btn btn-secondary closeModal ${Styles.cancelBtn}`} data-bs-dismiss="modal" onClick={resetForm}>
                取消
              </button>
              <button 
                type="button" 
                className={`${Styles.okBtn} btn`} 
                onClick={handleSubmit}
              >確定建立</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
