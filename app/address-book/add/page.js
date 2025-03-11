"use client";
import React, { useState } from "react";

export default function ABAddPage() {
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

  return (
    <div className="row">
      <div className="col-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">新增通訊錄</h5>
            <form>
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
                新增
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
