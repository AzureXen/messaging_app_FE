'use client'
import React, {useEffect, useState} from 'react'
import Styles from "./page.module.css"
import MessageBubble from "@/components/small-components/message-bubble/message-bubble";
import {createMessage, fetchMessages} from "@/services/messages";

const Channels = () => {

    const [messages, setMessages] = useState([])
    const [draftMessage, setDraftMessage] = useState('')

    useEffect(() => {
        const getMessages = async () => {
            try{
                const response = await fetchMessages(1);
                console.log("channels/page.js: getMessage response: ");
                console.log(response);
                setMessages(response.data);
            }catch(e){
                console.log("error while getting messages,");
                console.error(e);
            }
        }
        getMessages();

    },[])

    const sendMessage = async () =>{
        try{
            console.log("sending message...");
            await createMessage(1, draftMessage, "TEXT");
        }catch(e){
            console.log("services/messages/page: error while sending message: ");
            console.error(e);
        }
    }

    const handleSendMessage = async () => {
        if (draftMessage.trim() === '') return;

        await sendMessage();

        setDraftMessage('');
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
        // Shift+Enter will create a new line (default behavior)
    }


    return (
        <div className={Styles.channels}>
            <div className={Styles.header}>
                epic header
            </div>

            <div className={Styles.content}>
                <div className={Styles.messagesBox}>
                    {messages.map((message, index) => (
                        <MessageBubble name={message.senderName} content={message.content} datetime={message.createdAt} key={index} />
                    ))}
                </div>
                <div className={Styles.draftBox}>
                <textarea
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message here"
                    className={Styles.messageInput}
                    rows={1}
                />
                </div>
            </div>


        </div>
    )
}

export default Channels