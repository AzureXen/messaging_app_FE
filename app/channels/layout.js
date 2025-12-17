import React from 'react'
import MainHeader from "../../components/main-header/main-header.js";
import MainBase from "../../components/main-base/main-base.js";
import Style from "./layout.module.css"
const ChannelsLayout = ({children}) => {
  return (
    <>
        <div className={Style.channelsLayout}>
            <MainHeader />
            <MainBase>
                {children}
            </MainBase>
        </div>
    </>
  )
}

export default ChannelsLayout;

