"use client";


import { useRef, useState, useEffect } from "react";
import Style from "@/app/sport-level/sport-level.module.css"
import BadmintonLevels from "@/components/sport-level/badminton-level";


export default function SportLevel() {
  

  return (
    <>
    <div className={Style.paper}>
      <BadmintonLevels />
    </div>
    </>
  );
}
