'use client'
import React, {useEffect, useState} from 'react'
import Styles from "./main-base.module.css"
import { useAuth } from "@/context/AuthContext";
import Conversation from "@/components/conversation/conversation";
import { fetchConversations } from "@/services/conversations";
import ConversationContext from "../../context/ConversationContext";
import { useRouter } from "next/navigation";
import CreateConversationModal from "@/components/create-conversation-modal/create-conversation-modal";
import UserMenuModal from "@/components/user-menu-modal/user-menu-modal";

import {logout} from "@/services/auth";

const MainBase = ({children}) => {
    const {user, loading} = useAuth();
    const router=  useRouter();

    const [conversations, setConversations] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [conversationFilter, setConversationFilter] = useState('All');

    useEffect(() => {

        if(loading || user==null){
            return;
        }

        const getConversations = async () => {
            try{
                console.log("fetching conversations");
                const filterRules = {
                    "All": null,
                    "Group": true,
                    "Direct": false,
                };
                const isGroupParam = filterRules[conversationFilter] ?? null;

                console.log(isGroupParam);

                const response = await fetchConversations(isGroupParam);

                const list = response?.data ?? response;
                setConversations(list);
                console.log("conversations fetched:", list);
            }
            catch(err){
                console.log("main-base.js: error while fetching conversations");
                console.log(err);
            }
        }
        getConversations();
    },[loading, user, conversationFilter]);

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
                      <div
                        className={Styles.topIcon}
                        title="Friends"
                        role="button"
                        tabIndex={0}
                        onClick={() => router.push('/channels/friends')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            router.push('/channels/friends');
                          }
                        }}
                      >
                        <img src="/globe.svg" alt="Friends" />
                      </div>
                      <div className={Styles.sideBarHeader}>
                          <div className={Styles.sideBarHeaderLeft}>
                              <h4>Conversations</h4>
                              <select
                                aria-label="Conversation filter"
                                className={Styles.filterSelect}
                                value={conversationFilter}
                                onChange={(e) => setConversationFilter(e.target.value)}
                              >
                                <option value="All">All</option>
                                <option value="Group">Group</option>
                                <option value="Direct">Direct</option>
                              </select>
                          </div>
                          <div className={Styles.createConversationButton} onClick={() => setShowCreateModal(true)}>
                              <p>+</p>
                          </div>
                      </div>

                      <div className={Styles.conversationDisplay}>
                          {conversations.map((conversation, index) =>{
                              let conversationName;
                              if(conversation.isGroup){
                                  conversationName = conversation.conversationName;
                              }else{
                                  if(conversation.members[0].userName === user.userName){
                                      conversationName = conversation.members[1].userName;
                                  }
                                  else conversationName = conversation.members[0].userName;
                              }
                              return (
                                  <Conversation name={conversationName}
                                                id={conversation.id}
                                                key={index}
                                                lastMessage={conversation.lastMessage?.content}
                                  />
                              )
                              }

                          )}
                      </div>
                      {/* Open user menu modal on click */}
                      <div className={Styles.userDisplay}
                        onClick={() => setShowUserMenu(true)}
                        title="Account"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setShowUserMenu(true);
                          }
                        }}
                      >
                          {user?.displayName}
                      </div>
                  </div>

                  {/*
            This is suppose to be the second sidebar on the left like on Discord
            Where it contains me messages. but right now i just wanna show all types of Conversations
            On the "Group" Side bar
            */}
                  {/*<div className={Styles.sideBarExtend}>*/}
                  {/*     Epic side bar extend*/}
                  {/*</div>*/}

                  <div className={Styles.mainContent}>
                      {children}
                  </div>

                  <CreateConversationModal
                    open={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={(newConv) => {
                      setConversations((prev) => [newConv, ...prev]);
                    }}
                  />

                  <UserMenuModal
                    open={showUserMenu}
                    onClose={() => setShowUserMenu(false)}
                    onLogout={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    user={user}
                  />
              </div>
          </ConversationContext.Provider>
      </>
  )
}

export default MainBase
