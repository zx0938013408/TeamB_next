"use client";
import React from "react";
import Link from "next/link";

export default function ABNavbar() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" href="/address-book">
                  通訊錄列表
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/address-book/add">
                  新增
                </Link>
              </li>
            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" href="/quick-login">
                  快速登入
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/register">
                  會員註冊
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
