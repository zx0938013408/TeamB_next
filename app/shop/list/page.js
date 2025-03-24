"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  AB_LIST,
  AVATAR_PATH,
  AB_DELETE,
  TOGGLE_LIKE,
} from "@/config/shop-api-path";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaRegTrashCan,
  FaRegPenToSquare,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa6";
// import { useAuth } from "@/context/auth-context";
import LikeHeart from "../../../components/like-hearts";

export default function ABListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchRef = useRef();
  // const { auth, getAuthHeader } = useAuth();

  const [refresh, setRefresh] = useState(false);
  const [listData, setListData] = useState({
    success: false,
    perPage: 0,
    totalRows: 0,
    totalPages: 0,
    page: 0,
    rows: [],
    keyword: "",
  });

  const deleteItem = async (id) => {
    const r = await fetch(`${AB_DELETE}/${id}`, {
      method: "DELETE",
    });
    const result = await r.json();
    console.log(result);
    if (result.success) {
      setRefresh((o) => !o);
    }
  };
  const toggleLike = (id) => {
    fetch(`${TOGGLE_LIKE}/${id}`, {
      // headers: { ...getAuthHeader() },
    })
      .then((r) => r.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          // setRefresh(! refresh); // 讓頁面重新抓資料

          // 另一種作法, 直接變更頁面資料的狀態
          const newListData = structuredClone(listData);
          newListData.rows.forEach((r) => {
            if (r.id == result.id) {
              r.like_id = result.action == "add" ? true : false;
            }
          });
          setListData(newListData);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // debugger

    fetch(AB_LIST, {
      signal,
      // headers: { ...getAuthHeader() },
    })
      .then((r) => r.json())
      .then((obj) => {
        console.log(obj);
        if (obj.success) {
          setListData(obj);
        }
      })
      .catch(console.warn);
    return () => {
      // 取消或清除
      // effect clean-up
      controller.abort(); // 取消 ajax 的回應
    };
  }, [searchParams, refresh]);

  console.log(listData);

  return (
    <>
      <div className="row">
        <div className="col-6">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {Array(11)
                .fill(1)
                .map((v, i) => {
                  const p = listData.page - 5 + i;
                  if (p < 1 || p > listData.totalPages) return null;
                  const usp = new URLSearchParams(searchParams.toString());
                  usp.set("page", p);
                  return (
                    <li
                      className={
                        p == listData.page ? "page-item active" : "page-item"
                      }
                      key={p}
                    >
                      <Link className="page-link" href={`?${usp}`}>
                        {p}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>
        <div className="col-6">
          <form
            className="d-flex"
            role="search"
            onSubmit={(e) => {
              e.preventDefault(); // 不要以傳統的方式送出表單
              router.push(`?keyword=${searchRef.current.value}`);
            }}
          >
            <input
              ref={searchRef}
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>
                  <FaRegTrashCan />
                </th>
                <th>#</th>
                <th>圖片</th>
                <th>產品代號</th>
                <th>名稱</th>
                <th>分類代號</th>
                <th>描述</th>
                <th>價格</th>
                <th>尺寸</th>
                <th>顏色</th>
                <th>庫存</th>
                <th>
                  <FaRegPenToSquare />
                </th>
                <th>
                  <FaRegHeart />
                </th>
              </tr>
            </thead>
            <tbody>
              {listData.rows.map((r, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteItem(r.id);
                        }}
                      >
                        <FaRegTrashCan />
                      </a>
                    </td>
                    <td>{r.id}</td>
                    <td>
                      {r.image ? (
                        <img
                          src={`${AVATAR_PATH}/${r.image}`}
                          alt=""
                          height="100"
                        />
                      ) : null}
                    </td>
                    <td>{r.product_code}</td>
                    <td>{r.product_name}</td>
                    <td>{r.category_id}</td>
                    <td>{r.product_description}</td>
                    <td>{r.price}</td>
                    <td>{r.size}</td>
                    <td>{r.color}</td>
                    <td>{r.inventory}</td>
                    <td>
                      <Link href={`/shop/list/${r.id}`}>
                        <FaRegPenToSquare />
                      </Link>
                    </td>
                    <td>
                      <LikeHeart
                        checked={!!r.like_id}
                        onClick={() => {
                          toggleLike(r.id);
                        }}
                      />
                    </td>
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
