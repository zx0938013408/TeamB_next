import React from "react";

export default function ABAddPage() {
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
                  defaultValue={""}
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
