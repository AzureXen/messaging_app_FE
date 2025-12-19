'use client'
import React, {useEffect} from 'react'
import MainHeader from "../../components/main-header/main-header.js";
import MainBase from "../../components/main-base/main-base.js";
import Style from "./layout.module.css"
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
const ChannelsLayout = ({children}) => {

    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if(!loading){
            if (user===null){
                console.log("loading completed, and no user found. pushing login.");
                router.push("/login");
            }
        }
    }, [user, loading, router]);
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

