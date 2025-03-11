"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AB_LIST, AVATAR_PATH } from "@/config/api-path";
import { useRouter, useSearchParams } from "next/navigation";

export default function ABListPage() {
  const searchParams = useSearchParams();

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
    fetch(`${AB_LIST}${location.search}`)
      .then((r) => r.json())
      .then((obj) => {
        console.log(obj);
        if (obj.success) {
          setListData(obj);
        }
      });
  }, [searchParams]);

  console.log(listData);
  return (
    <>
      <div className="row">
        <div className="col">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {Array(11)
                .fill(1)
                .map((v, i) => {
                  return (
                    <li className="page-item" key={i}>
                      <Link className="page-link" href={`?page=${i + 1}`}>
                        {i + 1}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>
      </div>
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
