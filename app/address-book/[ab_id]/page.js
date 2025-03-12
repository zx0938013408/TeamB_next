"use client";
import React, { useEffect, useState } from "react";
import { AB_ADD_POST, AB_ITEM_GET, AB_ITEM_PUT } from "@/config/api-path";
import { useParams, useRouter } from "next/navigation";
import abSchema from "@/utils/schema/ab-schema";

export default function ABEditPage() {
  const params = useParams();
  const router = useRouter();
  const [myForm, setMyForm] = useState({
    ab_id: 0,
    name: "",
    email: "",
    mobile: "",
    birthday: "",
    address: "",
  });
  // 呈現欄位錯誤提示的狀態
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const myChangeForm = (e) => {
    setMyForm({ ...myForm, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // 欄位檢查
    const zResult = abSchema.safeParse(myForm);
    console.log(JSON.stringify(zResult, null, 4));

    // 預設每個欄位都沒有錯誤
    let newErrors = {
      name: "",
      email: "",
    };

    // 驗證沒有成功時
    if (!zResult.success) {
      zResult.error?.issues.forEach((item) => {
        newErrors[item.path[0]] = item.message;
      });
    }
    setErrors(newErrors);

    /*
{
    "success": false,
    "error": {
        "issues": [
            {
                "code": "too_small",
                "minimum": 3,
                "type": "string",
                "inclusive": true,
                "exact": false,
                "message": "請填寫正確的姓名",
                "path": [
                    "name"
                ]
            },
            {
                "validation": "email",
                "code": "invalid_string",
                "message": "請填寫正確的電子郵箱",
                "path": [
                    "email"
                ]
            }
        ],
        "name": "ZodError"
    }
}
    */

    /*
    const r = await fetch(AB_ADD_POST, {
      method: "POST",
      body: JSON.stringify(myForm),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await r.json();
    if (result.success) {
      alert("新增成功");
    } else {
      console.warn(result);
    }
      */
  };

  useEffect(() => {
    console.log(params);

    const ab_id = params.ab_id;
    if (!ab_id) {
      router.push("/address-book"); // 沒給 ab_id, 跳到列表頁
      return;
    }

    fetch(`${AB_ITEM_GET}/${ab_id}`)
      .then((r) => r.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          // 排除不要的欄位資料
          const { ab_id, name, email, mobile, birthday, address } = result.data;
          setMyForm({ ab_id, name, email, mobile, birthday, address });
        }
      });
  }, []);
  return (
    <div className="row">
      <div className="col-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">編輯通訊錄</h5>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  姓名 **
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={myForm.name}
                  onChange={myChangeForm}
                  style={ errors.name ? {border: '2px solid red'} : {}}
                />
                <div className="form-text">{errors.name}</div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  電郵 **
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={myForm.email}
                  onChange={myChangeForm}
                  style={ errors.email ? {border: '2px solid red'} : {}}
                />
                <div className="form-text">{errors.email}</div>
              </div>
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">
                  手機
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  value={myForm.mobile}
                  onChange={myChangeForm}
                  pattern="09\d{8}"
                />
                <div className="form-text" />
              </div>
              <div className="mb-3">
                <label htmlFor="birthday" className="form-label">
                  生日
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="birthday"
                  name="birthday"
                  value={myForm.birthday}
                  onChange={myChangeForm}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  地址
                </label>
                <textarea
                  className="form-control"
                  id="address"
                  name="address"
                  value={myForm.address}
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
