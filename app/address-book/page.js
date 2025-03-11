"use client";

import { useState, useEffect } from "react";
import { AB_LIST, AVATAR_PATH } from "@/config/api-path";

export default function ABListPage() {
  const [listData, setListData] = useState({
    success: false,
    perPage: 0,
    totalRows: 0,
    totalPages: 0,
    page: 0,
    rows: [],
    keyword: "",
  });

  useEffect(() => {
    fetch(AB_LIST)
      .then((r) => r.json())
      .then((obj) => {
        console.log(obj);
        if (obj.success) {
          setListData(obj);
        }
      });
  }, []);

  console.log(listData);
  return (
    <>
      <div className="row">
        <div className="col">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>姓名</th>
                <th>頭貼</th>
                <th>電郵</th>
                <th>手機</th>
                <th>生日</th>
                <th>地址</th>
              </tr>
            </thead>
            <tbody>
              {listData.rows.map((r, i) => {
                return (
                  <tr key={i}>
                    <td>{r.ab_id}</td>
                    <td>{r.name}</td>
                    <td>
                      {r.avatar ? (
                        <img
                          src={`${AVATAR_PATH}/${r.avatar}`}
                          alt=""
                          height="100"
                        />
                      ) : null}
                    </td>
                    <td>{r.email}</td>
                    <td>{r.mobile}</td>
                    <td>{r.birthday}</td>
                    <td>{r.address}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
