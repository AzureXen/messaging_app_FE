'use client'
import React, { useEffect, useState, useRef } from 'react'
import Styles from "./page.module.css"
import { useHeaderTitle } from "@/context/HeaderTitleContext"
import MessageBubble from "@/components/small-components/message-bubble/message-bubble";
import { fetchMessages } from "@/services/messages";
import { useWebSocket } from '@/hooks/useWebsocket';
import {useConversations} from "@/context/ConversationContext";
import {useParams, useRouter} from "next/navigation";
import {fetchConversationMembers, fetchIsMember} from "@/services/conversations";
import membersIcon from "@/public/members.png";
import Image from "next/image";
import {createInvite} from "@/services/invites";
import {useAuth} from "@/context/AuthContext";

const Channels = () => {

    const router = useRouter();
    
    const [fetchedIsMember, setFetchedIsMember] = useState(false);
    const [isMember, setIsMember] = useState(false);

    const {user, loading} = useAuth();

    const conversationId = Number(useParams().channelCode);
    const lastConversationIdRef = useRef(null);

    const [historyMessages, setHistoryMessages] = useState([]);
    const [draftMessage, setDraftMessage] = useState('');
    const textareaRef = useRef(null);

    const allConversations = useConversations();

    const currentConversationRef = useRef(null);
    

    const [displayingConversations, setDisplayingConversations] = useState([]);

    const [members, setMembers] = useState(null);
    const [showMembers, setShowMembers] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Currently, we do not generate the link on render, but rather when the user open the invite modal
    // We do not perform the fetch every time the user open the modal.
    const [inviteLink, setInviteLink] = useState("");
    const [firstOpenInviteModal, setFirstOpenInviteModal] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Auto-scroll
    const messagesEndRef = useRef(null);

    const { messages: liveMessages, sendMessage, isConnected } = useWebSocket(conversationId);

    // Combine History + Live messages
    const allMessages = [...historyMessages, ...liveMessages];

    const { setTitle } = useHeaderTitle();

    // I know, it's an error, but it works ...fine i think?

    if (lastConversationIdRef.current !== conversationId) {
        const found = allConversations?.find((c) => c.id === Number(conversationId));
        if (found) {
            currentConversationRef.current = found;
            lastConversationIdRef.current = conversationId;
        }
    }

    useEffect(()=>{
        const getIsMember = async () => {
            try{
                const response = await fetchIsMember(conversationId);
                setIsMember(response.data);
                setFetchedIsMember(true);
            }catch(ermWhatTheSigma){
                console.error("error while getting isMember, ", ermWhatTheSigma)
            }
        }
        getIsMember();
    },[conversationId, user])

    // TODO: make an error page where user try to access a server that they dont belong
    useEffect(()=>{
        if(fetchedIsMember){
            if(!isMember){
                console.warn("user does not belong to this conversation, pushing out.");
                router.push("/channels")
            }
        }
    },[fetchedIsMember, isMember, router])
    
    useEffect(() => {
        const currentConversation = currentConversationRef.current;
        if (currentConversation) {
            const newTitle = currentConversation.isGroup
                ? `# ${currentConversation.conversationName}`
                : `# ${currentConversation.members[0].userName === user.userName ? currentConversation.members[1].userName : currentConversation.members[0].userName}`;
            // Only update if changed to avoid cascading renders
            setTitle((prev) => (prev === newTitle ? prev : newTitle));
        }
        return () => {
            setTitle(':)');
        };
        // Only react to channel changes; we intentionally ignore allConversations changes
    }, [conversationId, setTitle, user]);

    useEffect(() => {

        if(loading || user==null){
            return;
        }

        const getMessages = async () => {
            try{
                const response = await fetchMessages(conversationId);
                setHistoryMessages(response.data);
            } catch(e) {
                console.error("Error fetching history:", e);
            }
        }

        const getMembers = async () =>{
            try{
                const response = await fetchConversationMembers(conversationId);
                setMembers(response.data);
            }
            catch(e) {
                console.error("Error fetching conversation members:", e);
            }
        }

        getMessages();
        getMembers();
    }, [conversationId, loading, user]);


    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages]);


    
    

    const handleSendMessage = async () => {
        if (draftMessage.trim() === '') return;

        sendMessage(draftMessage);

        setDraftMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    // auto resize textArea based on the size of user's input
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto first to allow shrinking
            textarea.style.height = 'auto';
            // Set height to the scroll height (content size)
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };
    useEffect(() => {
        adjustTextareaHeight();
    }, [draftMessage]);

    // Currently, we always create an invitation link that never expires and with unlimited usage
    const getInviteLink = async () => {
        try{
            const payload = {
                conversationId: currentConversation.id,
                maxUses: null,
                expiresAt: null,
            };
            const response = await createInvite(payload);
            console.log("Fetched invite:", response);
            setInviteLink(response.data.link);
        }catch(e) {
            console.error("Error fetching invite link:", e);
        }
    }

    const handleOpenInviteModal = () => {
        setShowInviteModal(true);

        if(!firstOpenInviteModal){
            setFirstOpenInviteModal(true);
            getInviteLink();
        }

    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);

            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);

        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className={Styles.channels}>
            <div className={Styles.header}>
                <div className={Styles.headerLeft}>
                    # {currentConversationRef.current?.conversationName}
                    <span style={{ fontSize: '0.8em', marginLeft: '10px', color: isConnected ? '#4caf50' : '#f44336' }}>
                        {isConnected ? '● Connected' : '○ Connecting...'}
                    </span>
                </div>
                <div className={Styles.headerRight}>
                    <button
                        className={Styles.iconButton}
                        title={showMembers ? 'Hide members' : 'Show members'}
                        onClick={() => setShowMembers(prev => !prev)}
                        aria-label={showMembers ? 'Hide members panel' : 'Show members panel'}
                    >
                        <Image src={membersIcon} alt={"members"} className={Styles.iconImage}>
                        </Image>
                    </button>
                    <button
                        className={Styles.iconButton}
                        title="Invite people"
                        onClick={() => handleOpenInviteModal()}
                        aria-label="Open invite modal"
                    >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                            <path d="M15 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Zm2 13a1 1 0 0 1-1-1 7 7 0 0 0-14 0 1 1 0 0 1-2 0 9 9 0 0 1 18 0 1 1 0 0 1-1 1Zm2-6h-2v-2a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2Z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={Styles.contentWrapper}>
                <div className={Styles.content}>
                    <div className={Styles.messagesBox}>
                        {allMessages.map((message, index) => (
                            <MessageBubble
                                name={message.senderName || "Unknown"}
                                content={message.content}
                                datetime={message.createdAt}
                                key={index}
                            />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={Styles.draftBox}>
                    <textarea
                        ref={textareaRef}
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isConnected ? `Send message to #${currentConversationRef.current?.conversationName}` : "Connecting..."}
                        disabled={!isConnected}
                        className={Styles.messageInput}
                        rows={1}
                    />
                    </div>
                </div>
                {showMembers && (
                <div className={Styles.sideContent}>
                    {Array.isArray(members) && members.length > 0 ? (
                        <div className={Styles.membersPanel}>
                            {/* Creator section */}
                            {members.some(m => m.role === 'CREATOR') && (
                                <div className={Styles.section}>
                                    <div className={Styles.sectionHeader}>— Creator —</div>
                                    <ul className={Styles.memberList}>
                                        {members.filter(m => m.role === 'CREATOR').map(m => (
                                            <li key={m.userId} className={Styles.memberItem}>
                                                <span className={Styles.userName}>{m.userName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Members section */}
                            {members.some(m => m.role !== 'CREATOR') && (
                                <div className={Styles.section}>
                                    <div className={Styles.sectionHeader}>— Members —</div>
                                    <ul className={Styles.memberList}>
                                        {members.filter(m => m.role !== 'CREATOR').map(m => (
                                            <li key={m.userId} className={Styles.memberItem}>
                                                <span className={Styles.userName}>{m.userName}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={Styles.membersPanel}>
                            <div className={Styles.sectionHeader}>Members</div>
                            <div className={Styles.emptyState}>No members found.</div>
                        </div>
                    )}
                </div>
                )}
            </div>
            {showInviteModal && (
                <div className={Styles.inviteModalBackdrop} onClick={(e) => {
                    if (e.target === e.currentTarget) setShowInviteModal(false);
                }}>
                    <div className={Styles.inviteModal} role="dialog" aria-modal="true" aria-labelledby="inviteTitle">
                        <div className={Styles.inviteHeader}>
                            <h3 id="inviteTitle">Invite friends to #{currentConversationRef.current?.conversationName}</h3>
                            <button className={Styles.modalCloseBtn} aria-label="Close" onClick={() => setShowInviteModal(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/></svg>
                            </button>
                        </div>
                        <div className={Styles.inviteBody}>
                            <div className={Styles.inputRow}>
                                <input
                                    type="text"
                                    className={Styles.inviteInput}
                                    readOnly
                                    value={`${inviteLink}`}
                                />
                                <button className={Styles.copyBtn} onClick={()=> handleCopy()} title="Copy invite link">
                                    Copy
                                </button>
                            </div>
                            {isCopied && (
                                <p className={Styles.copySuccessText}>
                                    Copied invite link!
                                </p>
                            )}
                            <p className={Styles.helperText}>Invite all your fellas.</p>
                        </div>
                        <div className={Styles.inviteFooter}>
                            <button className={Styles.secondaryBtn} onClick={() => setShowInviteModal(false)}>Close</button>
                            <button className={Styles.primaryBtn} disabled title="Generate new link (to be implemented)">Generate New Link</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Channels