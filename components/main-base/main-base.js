'use client'
import React, {useEffect, useState} from 'react'
import Styles from "./main-base.module.css"
import { useAuth } from "../../context/AuthContext";
import Conversation from "@/components/conversation/conversation";
import {fetchConversations} from "@/services/conversations";
const MainBase = ({children}) => {
    const {user} = useAuth();

    const [conversations, setConversations] = useState([]);
    useEffect(() => {
        const getConversations = async () => {
            try{
                console.log("fetching conversations");
                const response = await fetchConversations();
                setConversations(response.data);
                console.log(response);
            }
            catch(err){
                console.log("main-base.js: error while fetching conversations");
                console.log(err);
            }
        }
        getConversations();
    },[])

  return (
      <>
        <div className={Styles.mainBase}>
            <div className={Styles.sideBar}>
                <div className={Styles.conversationDisplay}>
                    {conversations.map((conversation, index) => (
                        <Conversation name={conversation.conversationName}
                                      key={index}
                                      lastMessage={conversation.lastMessage?.content} />
                    ))}
                </div>
                <div className={Styles.userDisplay}>
                    {user?.userName}
                </div>
            </div>

            {/*
            This is suppose to be the second sidebar on the left like on Discord
            Where it contains direct messages. but right now i just wanna show all types of Conversations
            On the "Group" Side bar
            */}
            {/*<div className={Styles.sideBarExtend}>*/}
            {/*     Epic side bar extend*/}
            {/*</div>*/}

            <div className={Styles.mainContent}>
                {children}
            </div>
        </div>
      </>
  )
}

export default MainBase
