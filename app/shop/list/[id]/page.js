"use client";
import React, { useEffect, useState } from "react";
import { AB_ITEM_GET, AB_ITEM_PUT } from "@/config/shop-api-path";
import { useParams, useRouter } from "next/navigation";
// import abSchema from "@/utils/schema/ab-schema";

export default function ABEditPage() {
  const params = useParams();
  const router = useRouter();
  const [myForm, setMyForm] = useState({
    id: 0,
    image: null,
    product_code: "",
    product_name: "",
    category_id: "",
    product_description: "",
    price: "",
    size: "",
    color: "",
    inventory: "",
  });
  // 呈現欄位錯誤提示的狀態
  const [errors, setErrors] = useState({
    product_name: "",
    category_id: "",
  });

  const myChangeForm = (e) => {
    setMyForm({ ...myForm, [e.target.name]: e.target.value });
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   // 欄位檢查
  //   const zResult = abSchema.safeParse(myForm);
  //   console.log(JSON.stringify(zResult, null, 4));

  //   // 預設每個欄位都沒有錯誤
  //   let newErrors = {
  //     product_name: "",
  //     category_id: "",
  //   };

  //   // 驗證沒有成功時
  //   if (!zResult.success) {
  //     zResult.error?.issues.forEach((item) => {
  //       newErrors[item.path[0]] = item.message;
  //     });
  //   }
  //   setErrors(newErrors);

  //   if (newErrors.product_name || newErrors.category_id) {
  //     // 有欄位沒通過檢查時, 直接返回結束
  //     return;
  //   }

  //   const r = await fetch(`${AB_ITEM_PUT}/${myForm.id}`, {
  //     method: "PUT",
  //     body: JSON.stringify(myForm),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const result = await r.json();
  //   if (result.success) {
  //     alert("修改成功");
  //     router.back(); // 回上一頁
  //   } else {
  //     alert("資料沒有修改");
  //     console.warn(result);
  //   }
  // };
  
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", myForm.id);
    formData.append("product_code", myForm.product_code);
    formData.append("product_name", myForm.product_name);
    formData.append("category_id", myForm.category_id);
    formData.append("product_description", myForm.product_description);
    formData.append("price", myForm.price);
    formData.append("size", myForm.size);
    formData.append("color", myForm.color);
    formData.append("inventory", myForm.inventory);

    // 檢查是否有選擇圖片
    if (myForm.image instanceof File) {
      formData.append("image", myForm.image); // 上傳圖片
    }
    try {
      const path = `${AB_ITEM_PUT}/${myForm.id}`;

      const r = await fetch(path, {
        method: "PUT", // ✅ 改成 PUT 更新資料
        body: formData, // 使用 FormData
      });

      const result = await r.json();
      if (result.success) {
        alert("修改成功");
        router.push("/shop/list");
      } else {
        alert("修改失敗");
      }
    } catch (error) {
      console.error("API 錯誤:", error);
    }
  };

  useEffect(() => {
    console.log(params);

    const id = params.id;
    if (!id) {
      router.push("/list"); // 沒給 id, 跳到列表頁
      return;
    }

    fetch(`${AB_ITEM_GET}/${id}`)
      .then((r) => r.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          // 排除不要的欄位資料
          const {
            id,
            image,
            product_code,
            product_name,
            category_id,
            product_description,
            price,
            size,
            color,
            inventory,
          } = result.data;
          setMyForm({
            id,
            image,
            product_code,
            product_name,
            category_id,
            product_description,
            price,
            size,
            color,
            inventory,
          });
        }
      });
  }, []);

  return (
    <div className="row">
      <div className="col-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">編輯商品</h5>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  圖片**
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="image"
                  name="image"
                  onChange={(e) =>
                    setMyForm({ ...myForm, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  產品編號**
                </label>
                <input
                  disabled
                  type="text"
                  className="form-control"
                  id="product_code"
                  name="product_code"
                  value={myForm.product_code}
                  onChange={myChangeForm}
                  style={errors.product_code ? { border: "2px solid red" } : {}}
                />
                <div className="form-text">{errors.product_code}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  名稱 **
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="product_name"
                  name="product_name"
                  value={myForm.product_name}
                  onChange={myChangeForm}
                  style={errors.product_name ? { border: "2px solid red" } : {}}
                />
                <div className="form-text">{errors.product_name}</div>
              </div>

              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  分類
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="category_id"
                  name="category_id"
                  value={myForm.category_id}
                  onChange={myChangeForm}
                />
                <div className="form-text" />
              </div>

              <div className="mb-3">
                <label htmlFor="birthday" className="form-label">
                  價格
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="price"
                  value={myForm.price}
                  onChange={myChangeForm}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  尺寸
                </label>
                <input
                  className="form-control"
                  id="size"
                  name="size"
                  value={myForm.size}
                  onChange={myChangeForm}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  顏色
                </label>
                <input
                  className="form-control"
                  id="color"
                  name="color"
                  value={myForm.color}
                  onChange={myChangeForm}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  庫存
                </label>
                <input
                  className="form-control"
                  id="inventory"
                  name="inventory"
                  value={myForm.inventory}
                  onChange={myChangeForm}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                修改
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
