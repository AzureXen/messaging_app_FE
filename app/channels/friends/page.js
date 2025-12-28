'use client'
import React, { useEffect, useMemo, useState } from 'react';
import Styles from './page.module.css';
import { useHeaderTitle } from '@/context/HeaderTitleContext';

// NOTE: Data fetching not implemented. You can wire your services and set these states.
const FriendsPage = () => {
  const { setTitle } = useHeaderTitle();

  // Tabs: 'friends' (title chip), 'all', 'pending', 'requests', 'add'
  const [activeTab, setActiveTab] = useState('friends');

  // Placeholders to be populated via your services later
  const [allFriends, setAllFriends] = useState([]); // [{id, userName}]
  const [pending, setPending] = useState([]); // outgoing requests
  const [requests, setRequests] = useState([]); // incoming requests

  // Add Friend search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // [{id, userName}]

  useEffect(() => {
    setTitle('Friends');
    return () => setTitle('Header');
  }, [setTitle]);

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

  const AddFriend = () => (
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
            // TODO: wire your search service here.
            // setSearchResults(await searchUsers(searchQuery))
            console.log('Search for', searchQuery);
          }}
        >
          Search
        </button>
      </div>

      <div className={Styles.resultsBox}>
        <List
          items={searchResults}
          emptyText={searchQuery ? 'No users found.' : 'Search for your buddies!'}
          actionLabel="Send"
          onAction={(u) => {
            // TODO: wire your send friend request call here
            console.log('Send request to', u);
          }}
        />
      </div>
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
          {activeTab === 'add' && <AddFriend />}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
