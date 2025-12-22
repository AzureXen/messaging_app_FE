'use client'
import React, { useEffect, useState, useRef } from 'react'
import Styles from "./page.module.css"
import MessageBubble from "@/components/small-components/message-bubble/message-bubble";
import { fetchMessages } from "@/services/messages";
import { useWebSocket } from '@/hooks/useWebsocket';
import {useConversations} from "@/context/ConversationContext";
import {useParams} from "next/navigation";

const Channels = () => {

    const conversationId = Number(useParams().channels);

    const [historyMessages, setHistoryMessages] = useState([]);
    const [draftMessage, setDraftMessage] = useState('');
    const textareaRef = useRef(null);

    const allConversations = useConversations();
    const currentConversation = allConversations?.find(
        (conversation) => conversation.id === conversationId
    )

    // Auto-scroll
    const messagesEndRef = useRef(null);

    const { messages: liveMessages, sendMessage, isConnected } = useWebSocket(conversationId);

    // Combine History + Live messages
    const allMessages = [...historyMessages, ...liveMessages];

    useEffect(() => {
        const getMessages = async () => {
            try{
                const response = await fetchMessages(conversationId);
                console.log("Fetched history:", response);
                setHistoryMessages(response.data);
            } catch(e) {
                console.error("Error fetching history:", e);
            }
        }
        getMessages();
    }, [conversationId]);

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

    return (
        <div className={Styles.channels}>
            <div className={Styles.header}>
                # {currentConversation?.conversationName}
                <span style={{ fontSize: '0.8em', marginLeft: '10px', color: isConnected ? '#4caf50' : '#f44336' }}>
                    {isConnected ? '● Connected' : '○ Connecting...'}
                </span>
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
                        placeholder={isConnected ? `Send message to #${currentConversation?.conversationName}` : "Connecting..."}
                        disabled={!isConnected}
                        className={Styles.messageInput}
                        rows={1}
                    />
                    </div>
                </div>
                <div className={Styles.sideContent}>
                    Friends :]
                </div>
            </div>
        </div>
    )
}

export default Channels