"use client";
import React from 'react'
import Style from "./main-header.module.css"
import { useHeaderTitle } from "@/context/HeaderTitleContext";

const MainHeader = () => {
  const { title } = useHeaderTitle();
  return (
    <div className={Style.mainHeader}>
      <p>{title}</p>
    </div>
  )
}

export default MainHeader
