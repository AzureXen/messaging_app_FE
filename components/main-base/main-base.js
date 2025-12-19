'use client'
import React, {useEffect, useState} from 'react'
import Styles from "./main-base.module.css"
import { useAuth } from "@/context/AuthContext";
import Conversation from "@/components/conversation/conversation";
import {fetchConversations} from "@/services/conversations";
import ConversationContext from "../../context/ConversationContext";
import {useRouter} from "next/navigation";

import {logout} from "@/services/auth";

const MainBase = ({children}) => {
    const {user} = useAuth();
    const router=  useRouter();

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

    const handleLogout = () => {
        logout();
        console.log("main-base: pushing login");
        router.push("/login");
    }

  return (
      <>
          <ConversationContext.Provider value={conversations}>
              <div className={Styles.mainBase}>
                  <div className={Styles.sideBar}>

                      <div className={Styles.sideBarHeader}>
                          <h4>Conversations</h4>
                          <div className={Styles.createConversationButton}>
                              <p>+</p>
                          </div>
                      </div>

                      <div className={Styles.conversationDisplay}>
                          {conversations.map((conversation, index) => (
                              <Conversation name={conversation.conversationName}
                                            id={conversation.id}
                                            key={index}
                                            lastMessage={conversation.lastMessage?.content}
                              />
                          ))}
                      </div>
                      {/*TODO: MAKE AN ACTUAL LOGOUT BUTTON*/}
                      <div className={Styles.userDisplay}
                        onClick={() => handleLogout()}
                      >
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
          </ConversationContext.Provider>
      </>
  )
}

export default MainBase
