'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Styles from './page.module.css';
import { useHeaderTitle } from '@/context/HeaderTitleContext';
import {fetchAllPendings, findUserByNameAndCode, sendFriendRequest} from "@/services/userRelationships";
import {useAuth} from "@/context/AuthContext";

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

    fetchPendings();
  },[user,loading])

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
      if(!firstSearchSent){
          setFirstSearchSent(true);
      }
      console.log("searching for: " , searchQuery);

      const parsedSearchQuery = searchQuery.replaceAll("#", "%23");

      console.log("parsedSearchQuery", parsedSearchQuery);

      try{
          const response = await findUserByNameAndCode(parsedSearchQuery);
          console.log("response of search user: ", response);
          setSearchResults(response.data);
      }catch(ermWhatTheSigma){
          console.error("error while performing user search: ", ermWhatTheSigma);
      }
  }

  const handleSendFriendRequest = async (userId)=>{
      const payload = {
          receiverId: userId
      }
      try{

          const response = await sendFriendRequest(payload);
          console.log("response of sending friend request: ", response);

      }catch(ermWhatTheSigma){
          console.error("error while sending friend request: ", ermWhatTheSigma);
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
          {items.map((u) => (
            <li key={u.id} className={Styles.listItem}>
              <span className={Styles.userName} title={u.userName}>{u.userName}</span>
              {actionLabel && (
                <button className={Styles.actionBtn} onClick={() => onAction?.(u)}>{actionLabel}</button>
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
              actionLabel={null}
            />
          )}
          {activeTab === 'pending' && (
            <List
              items={pending}
              emptyText="You don't have any pending requests."
              actionLabel={null}
            />
          )}
          {activeTab === 'requests' && (
            <List
              items={requests}
              emptyText="You have no incoming friend requests."
              actionLabel={null}
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
