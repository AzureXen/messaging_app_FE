import React from 'react'
import styles from "./message-bubble.module.css"

const MessageBubble = ({name, datetime, content}) => {
    //Formatting time
    const dateObj = new Date(datetime);

    // 2. Format it (Example: "12/23/2025, 8:29 AM")
    const formattedTime = dateObj.toLocaleString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
  return (
    <>
        <div className={styles.messageBubble}>
            <div className={styles.messageInfo}>
                <h4>{name}</h4>
                <p>{formattedTime}</p>
            </div>
            <div className={styles.messageContent}>
                <p>{content}</p>
            </div>
        </div>
    </>
  )
}

export default MessageBubble
