"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Styles from "./create.module.css";
import "@/public/TeamB_Icon/style.css";
import "@/styles/globals.css";
import { AL_CREATE_POST } from "@/config/api-path";
import CitySelector from "@/components/city-area/city";
import AreaSelector from "@/components/city-area/area";


export default function ActivityCreatePage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [cityData, setCityData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [images, setImages] = useState(Array(4).fill(null));
  const imageInputRef = useRef([]);
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const [formData, setFormData] = useState({
    activity_name: "",
    sport_type_id: "",
    area_id: "",
    court_id : 3,
    activity_time: "",
    deadline: "",
    payment: "",
    need_num: "",
    introduction: "",
    address: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
       ...formData,
        [name]: value ,
        sport_type_id: selectedId,
        founder_id: 23  // TODO: 待引入到會員當中
      });
      
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
  

  const handleSubmit = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // ✨ 補上預設的 court_id 與 founder_id（實際可從 UI 或登入者取得）
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
        alert("活動建立成功！");
        // 先關閉 Modal
        closeModal();
        setSelected("")
        
        // 延遲導向，避免 Modal 遮罩殘留
        setTimeout(() => {
          router.push(`/activity-list/${al_id}`);
        }, 400); // Bootstrap Modal 動畫大約 300ms

      } else {
        alert("建立失敗：" + (result.error?.issues?.[0]?.message || "未知錯誤"));
      console.error();
      }
    } catch (err) {
      console.error("發生錯誤:", err);
      alert("發生錯誤，請稍後再試。");
    }
  };

  return (
    <>
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
          <button className={Styles.goBack} onClick={() => router.back()}>
            <Image src="/photo/logo/TeamB-logo-whiteYellow.png" alt="TeamB Logo" width={20} height={20} /> 回上一頁
          </button>
          <div className={`${Styles.sport} row`}>
            <a href="#" className={`col ${Styles.select}`} onMouseEnter={() => setHovered("basketball")} onMouseLeave={() => setHovered(null)} 
            onClick={() => {
              setSelected("basketball")
              setSelectedId(1)
              openModal()
              }}>
              <div className={`${Styles.sportType} ${Styles.basketball}`}>
                <div className={`icon-Basketball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>籃球</h3>
              </div>
            </a>
            <Link href="#" className={`col ${Styles.select}`} onMouseEnter={() => setHovered("volleyball")} onMouseLeave={() => setHovered(null)} 
            onClick={() => {
              setSelected("volleyball")
              setSelectedId(2)
              openModal()
            }}>
              <div className={`${Styles.sportType} ${Styles.volleyball}`}>
                <div className={`icon-Volleyball ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>排球</h3>
              </div>
            </Link>
            <Link href="#" className={`col ${Styles.select}`} onMouseEnter={() => setHovered("shuttlecock")} onMouseLeave={() => setHovered(null)} 
            onClick={() => {
              setSelected("shuttlecock")
              setSelectedId(3)
              openModal()
              }}>
              <div className={`${Styles.sportType} ${Styles.shuttlecock}`}>
                <div className={`icon-Badminton ${Styles.sportIcon}`}></div>
                <h3 className={Styles.sportTitle}>羽球</h3>
              </div>
            </Link>
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
                {selected && <span className={`icon-${selected.charAt(0).toUpperCase() + selected.slice(1)} ${Styles.modalIcon}`}></span>}
                建立{selected ? (selected === "basketball" ? "籃球" : selected === "volleyball" ? "排球" : "羽球") : ""}活動
              </h5>
              <button type="button" className={`btn-close ${Styles.closeModal}`} data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelected("")} />
            </div>
            <div className={`modal-body ${Styles.modalWidth}`}>
              {/* <label>創建者</label>
              <input type="text" name="founder_id" className={Styles.createInput} onChange={handleInputChange} value={selectedId} /> */}
              <label>活動名稱</label>
              <input type="text" name="activity_name" className={Styles.createInput} onChange={handleInputChange} />
              {/* <label>運動類別 ID（手動輸入測試用）</label>
              <input type="text" name="sport_type_id" className={Styles.createInput} onChange={handleInputChange} /> */}
              <label>活動地點</label>
              {/* 引入縣市選擇功能 */}
              <div className={`${Styles.createInput} ${Styles.createInputDistance}`} >
              <span className={`${Styles.distance}`}>
              <CitySelector
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                setCityData={setCityData}
              />
              </span>
              <span className={`${Styles.line} ${Styles.distance}`}>|</span>
              <span >
              <AreaSelector
                selectedCity={selectedCity}
                selectedArea={selectedArea}
                setSelectedArea={setSelectedArea}
                cityData={cityData}
                handleInputChange={handleInputChange}
              />
              </span>
              </div>
              {/* <select 
              name="area_id" 
              className={Styles.createInput} 
              onChange={handleInputChange}
              >
                <option value="1">東區</option>
                <option value="2">南區</option>
                <option value="3">永康區</option>
              </select> */}
              <input type="text" name="court_id" className={Styles.createInput} placeholder="球館 / 地點" onChange={handleInputChange} />
              <label>活動時間</label>
              <input type="datetime-local" name="activity_time" className={Styles.createInput} onChange={handleInputChange} />
              <label>報名截止期限</label>
              <input type="datetime-local" name="deadline" className={Styles.createInput} onChange={handleInputChange} />
              <label>需求人數</label>
              <input type="number" name="need_num" className={Styles.createInput} onChange={handleInputChange} />
              <label>費用(每人)</label>
              <input type="number" name="payment" className={Styles.createInput} onChange={handleInputChange} />
              <label>活動詳情</label>
              <textarea name="introduction" className={Styles.createInput} placeholder="本活動歡迎新手參加" onChange={handleInputChange}></textarea>
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
            <div className={`modal-footer ${Styles.modalWidth}`}>
              <button type="button" className={`btn btn-secondary closeModal ${Styles.cancelBtn}`} data-bs-dismiss="modal" onClick={() => setSelected("")}>取消</button>
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
