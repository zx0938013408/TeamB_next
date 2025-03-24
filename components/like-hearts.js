import { useState } from "react";
import Styles from "@/styles/like-heart.module.css";
import { TOGGLE_LIKE } from "@/config/api-path";

export default function LikeHeart({ checked = false, activityId }) {
  const [isLiked, setIsLiked] = useState(checked);

  const toggleLike = async () => {
    const res = await fetch(TOGGLE_LIKE, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId }),
    });
    const data = await res.json();
    if (data.success) setIsLiked(data.liked);
  };

  return (
    <span
      className={`icon-Heart-Fill ${isLiked ? Styles.iconHeartFill : Styles.iconLikeStroke}`}
      onClick={toggleLike}
    ></span>
  );
}

