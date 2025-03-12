"use client";
import React, { useEffect, useState } from "react";
import { AB_ADD_POST, AB_ITEM_GET, AB_ITEM_PUT } from "@/config/api-path";
import { useParams, useRouter } from "next/navigation";
import abSchema from "@/utils/schema/ab-schema";

export default function ABEditPage() {
  const params = useParams();
  const router = useRouter();
  const [myForm, setMyForm] = useState({
    name: "",
    email: "",
    mobile: "",
    birthday: "",
    address: "",
  });

  const myChangeForm = (e) => {
    setMyForm({ ...myForm, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // TODO: 欄位檢查
    const zResult = abSchema.safeParse(myForm);
    console.log(JSON.stringify(zResult, null, 4));

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
          setMyForm(result.data);
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
                />
                <div className="form-text" />
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
                />
                <div className="form-text" />
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
