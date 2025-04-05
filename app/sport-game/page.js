"use client"

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import "@/app/sport-game/sport-game.css"

export default function SportGamePage() {

return(
    <>
    <h2 className="gameTitle">手指運動中心</h2>
    <div className="pageContainer">
        <a 
            href="/game-basketball"
            className="basketballGame"
        >  
            <div className="gameBtn">
                開始遊戲
            </div>
        </a>
        <a 
            href="/game-volleyball"
            className="volleyballGame"
        >
            <div className="gameBtn">
                開始遊戲
            </div>
        </a>
    </div>
    </>
)

}