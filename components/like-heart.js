"use client";
import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function LikeHeart({ checked, onClick = () => {} }) {
  const [myChecked, setMyChecked] = useState(false);
  return (
    <span style={{ color: "red" }} onClick={() => setMyChecked(!myChecked)}>
      {myChecked ? <FaHeart /> : <FaRegHeart />}
    </span>
  );
}
