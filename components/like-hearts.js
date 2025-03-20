import { useState } from "react";
import "@/public/TeamB_Icon/style.css";
import Styles from "@/styles/like-heart.module.css"

export default function LikeHeart({ checked, onClick = () => {} }) {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <span
      className={`icon-Heart-Fill ${isLiked ? Styles.iconHeartFill : Styles.iconLikeStroke}`}
      onClick={() => setIsLiked((prev) => !prev)}
    ></span>
  );
}
