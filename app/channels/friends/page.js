'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Styles from './page.module.css';
import { useHeaderTitle } from '@/context/HeaderTitleContext';
import {
    acceptFriendRequest, cancelFriendRequest,
    fetchAllFriends,
    fetchAllPendings,
    fetchAllReceivedRequests,
    findUserByNameAndCode, rejectFriendRequest,
    sendFriendRequest, unfriendUser
} from "@/services/userRelationships";
import {useAuth} from "@/context/AuthContext";

import {toast} from 'react-toastify';
import {findOrCreateDirectMessage} from "@/services/conversations";
import {useRouter} from "next/navigation";

const FriendsPage = () => {
  const { setTitle } = useHeaderTitle();

  const { user, loading } = useAuth();

  // Tabs: 'friends' (title chip), 'all', 'pending', 'requests', 'add'
  const [activeTab, setActiveTab] = useState('friends');

  // Placeholders to be populated via your services later
  const [allFriends, setAllFriends] = useState([]); // [{id, userName}]
  const [pending, setPending] = useState([]); // outgoing requests
  const [requests, setRequests] = useState([]); // incoming requests



  // Add Friend search
    const [firstSearchSent, setFirstSearchSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // [{id, userName}]

    const router = useRouter();
  useEffect(() => {
    setTitle('Friends');
    return () => setTitle('Header');
  }, [setTitle]);

  useEffect(() => {
    if(loading || user == null){
        return;
    }

      const fetchPendings = async () => {
          try{
              const response = await fetchAllPendings();
              console.log("fetched pendings response: ", response);
              setPending(response.data);
          }catch(ermWhatTheSigma){
              console.error("error while fetching pendings ", ermWhatTheSigma);
          }
      }

      if(activeTab === 'pending'){
          fetchPendings();
      }
  },[user,loading, activeTab]);

  useEffect(() => {
      const fetchPendings = async () => {
          try{
              const response = await fetchAllPendings();
              console.log("fetched pendings response: ", response);
              setPending(response.data);
          }catch(ermWhatTheSigma){
              console.error("error while fetching pendings ", ermWhatTheSigma);
          }
      }
      fetchPendings();

      const fetchReceivedRequests = async () => {
          try{
              const response = await fetchAllReceivedRequests();
              console.log("fetched received requests response: ", response);
              setRequests(response.data);
          }catch(ermWhatTheSigma){
              console.error("error while fetching received requests ", ermWhatTheSigma);
          }
      }
      fetchReceivedRequests();

      const fetchFriends = async () => {
          try{
              const response = await fetchAllFriends();
              console.log("fetched received requests response: ", response);
              setAllFriends(response.data);
          }catch(ermWhatTheSigma){
              console.error("error while fetching received requests ", ermWhatTheSigma);
          }
      }
      fetchFriends();
  },[])

  const showAll = allFriends.length > 0;
  const showPending = pending.length > 0;
  const showRequests = requests.length > 0;

  const tabs = useMemo(() => [
    { key: 'friends', label: 'Friends', visible: true, disabled: true },
    { key: 'all', label: 'All', visible: showAll },
    { key: 'pending', label: 'Pending', visible: showPending },
    { key: 'requests', label: 'Requests', visible: showRequests },
    { key: 'add', label: 'Find', visible: true },
  ], [showAll, showPending, showRequests]);

  const handleSearchUser = async ()=>{
      if(searchQuery === ""){ return; }
      if(!firstSearchSent){
          setFirstSearchSent(true);
      }

      const parsedSearchQuery = searchQuery.replaceAll("#", "%23");


      try{
          const response = await findUserByNameAndCode(parsedSearchQuery);
          setSearchResults(response.data);
      }catch(ermWhatTheSigma){
          console.error("error while performing user search: ", ermWhatTheSigma);
      }
  }

    const handleAcceptFriendRequest = async (userId)=>{
        const payload = {
            receiverId: userId,
        }

        try{
            await acceptFriendRequest(payload);
            toast.success("Accepted friend request!");
            const fetchReceivedRequests = async () => {
                try{
                    const response = await fetchAllReceivedRequests();
                    setRequests(response.data);
                }catch(ermWhatTheSigma){
                    console.error("error while fetching received requests ", ermWhatTheSigma);
                }
            }
            fetchReceivedRequests();

            const fetchFriends = async () => {
                try{
                    const response = await fetchAllFriends();
                    setAllFriends(response.data);
                }catch(ermWhatTheSigma){
                    console.error("error while fetching received requests ", ermWhatTheSigma);
                }
            }
            fetchFriends();

        }catch(ermWhatTheSigma){
            console.error("error while accepting friend request ", ermWhatTheSigma);
            toast.error("Accept friend request error");
        }
    }

    const handleRejectFriendRequest = async (userId)=>{
        const payload = {
            receiverId: userId,
        }

        try{
            await rejectFriendRequest(payload);
            const fetchReceivedRequests = async () => {
                try{
                    const response = await fetchAllReceivedRequests();
                    setRequests(response.data);
                }catch(ermWhatTheSigma){
                    console.error("error while fetching received requests ", ermWhatTheSigma);
                }
            }
            fetchReceivedRequests();

        }catch(ermWhatTheSigma){
            console.error("error while rejecting friend request ", ermWhatTheSigma);
            toast.error("Reject friend request error");
        }
    }

    const handleCancelFriendRequest = async (userId)=>{
        const payload = {
            receiverId: userId,
        }

        try{
            await cancelFriendRequest(payload);

            const fetchPendings = async () => {
                try{
                    const response = await fetchAllPendings();
                    console.log("fetched pendings response: ", response);
                    setPending(response.data);
                }catch(ermWhatTheSigma){
                    console.error("error while fetching pendings ", ermWhatTheSigma);
                }
            }
            fetchPendings();

        }catch(ermWhatTheSigma){
            console.error("error while cancelling friend request ", ermWhatTheSigma);
            toast.error("Cancel friend request error");
        }
    }

  const handleSendFriendRequest = async (userId)=>{
      const payload = {
          receiverId: userId
      }
      try{
          await sendFriendRequest(payload);
          toast.success("Sent friend request!");

          const fetchPendings = async () => {
              try{
                  const response = await fetchAllPendings();
                  console.log("fetched pendings response: ", response);
                  setPending(response.data);
              }catch(ermWhatTheSigma){
                  console.error("error while fetching pendings ", ermWhatTheSigma);
              }
          }
          fetchPendings();

      }catch(ermWhatTheSigma){
          console.error("error while sending friend request: ", ermWhatTheSigma);
          if(ermWhatTheSigma?.response.data.message){
              toast.warn(ermWhatTheSigma.response.data.message)
          }
      }
  }
    const handleUnfriend = async (userId)=>{
        const payload = {
            receiverId: userId
        }
        try{
            await unfriendUser(payload);

            const fetchFriends = async () => {
                try{
                    const response = await fetchAllFriends();
                    setAllFriends(response.data);
                }catch(ermWhatTheSigma){
                    console.error("error while fetching received requests ", ermWhatTheSigma);
                }
            }
            fetchFriends();

        }catch(ermWhatTheSigma){
            console.error("error while unfriending: ", ermWhatTheSigma);
            if(ermWhatTheSigma?.response.data.message){
                toast.warn(ermWhatTheSigma.response.data.message)
            }
        }
    }

    const handleChat = async (userId)=>{
        try{
            const findOrCreateDM = async () => {
                try{
                    const response = await findOrCreateDirectMessage(userId);
                    router.push(`/channels/${response.data.conversationId}`)

                }catch(ermWhatTheSigma){
                    console.error("error while finding or creating direct message ", ermWhatTheSigma);
                }
            }
            findOrCreateDM();

        }catch(ermWhatTheSigma){
            console.error("error while finding or creating chat: ", ermWhatTheSigma);
            if(ermWhatTheSigma?.response.data.message){
                toast.warn(ermWhatTheSigma.response.data.message)
            }
        }
    }

  const renderTab = (tab) => {
    if (!tab.visible) return null;
    const isActive = activeTab === tab.key;
    return (
      <button
        key={tab.key}
        className={isActive ? `${Styles.tab} ${Styles.tabActive}` : Styles.tab}
        onClick={() => !tab.disabled && setActiveTab(tab.key)}
        disabled={tab.disabled}
        title={tab.disabled ? tab.label : undefined}
      >
        {tab.label}
      </button>
    );
  };

  const List = ({ items, emptyText, actionLabel, onAction }) => (
    <div className={Styles.listBox}>
      {items.length === 0 ? (
        <div className={Styles.emptyState}>{emptyText}</div>
      ) : (
        <ul className={Styles.list}>
          {items.map((u, index) => (
            <li key={index} className={Styles.listItem}>
              <span className={Styles.userName} title={u.userName}>{u.userName}</span>
              {(actionLabel && u.id !== user.id) && (
                  <>
                      {(actionLabel==='AllFriends') && (
                          <div>
                              {(u.userName !== "GroqAI") && (
                                  <button
                                      style={{backgroundColor: "#AF002A"}}
                                      className={Styles.actionBtn} onClick={() => handleUnfriend(u.userId)}>Unfriend</button>
                              )}
                              <button
                                  style={{backgroundColor: "#5a69f1"}}
                                  className={Styles.actionBtn} onClick={() => handleChat(u.userId)}>Chat</button>

                          </div>

                      )}
                      {actionLabel==='Send' && (
                          <button
                                  className={Styles.actionBtn} onClick={() => onAction?.(u)}>{actionLabel}</button>
                      )}
                      {actionLabel==='Requests' && (
                          <div>
                              <button
                                  className={Styles.actionBtn} onClick={() => handleAcceptFriendRequest(u.userId)}>Accept</button>
                              <button
                                  style={{backgroundColor: "#AF002A"}}
                                  className={Styles.actionBtn} onClick={() => handleRejectFriendRequest(u.userId)}>Fuh Naw</button>
                          </div>
                      )}
                      {actionLabel==='Pendings' && (
                          <button
                              style={{backgroundColor: "#AF002A"}}
                              className={Styles.actionBtn} onClick={() => handleCancelFriendRequest(u.userId)}>Cancel</button>
                      )}
                  </>
              )}
                {u.id === user.id && (
                    <p
                    >It&#39;s you!</p>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className={Styles.friends}>
      <div className={Styles.header}>
        <div className={Styles.tabsRow}>
          {tabs.map(renderTab)}
        </div>
      </div>

      <div className={Styles.contentWrapper}>
        <div className={Styles.content}>
          {activeTab === 'friends' && (
            <div className={Styles.infoBox}>Select a category to view your friends or add new ones.</div>
          )}
          {activeTab === 'all' && (
            <List
              items={allFriends}
              emptyText="You don't have any friends yet."
              actionLabel="AllFriends"
            />
          )}
          {activeTab === 'pending' && (
            <List
              items={pending}
              emptyText="You don't have any pending requests."
              actionLabel="Pendings"
            />
          )}
          {activeTab === 'requests' && (
            <List
              items={requests}
              emptyText="You have no incoming friend requests."
              actionLabel="Requests"
            />
          )}
          {activeTab === 'add' && (
              <div className={Styles.addFriendBox}>
                  <div className={Styles.searchRow}>
                      <input
                          className={Styles.searchInput}
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                          className={Styles.searchBtn}
                          onClick={() => {
                              handleSearchUser();
                          }}
                      >
                          Search
                      </button>
                  </div>

                  <div className={Styles.resultsBox}>
                      <List
                          items={searchResults}
                          emptyText={(searchQuery&&firstSearchSent) ? 'No users found.' : 'Search for your buddies!'}
                          actionLabel="Send"
                          onAction={(u) => {
                              handleSendFriendRequest(u.id);
                              console.log('Send request to', u);
                          }}
                      />
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
