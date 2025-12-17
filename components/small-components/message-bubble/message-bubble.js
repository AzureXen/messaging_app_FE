import React from 'react'
import styles from "./message-bubble.module.css"

const MessageBubble = ({name, datetime, content}) => {
  return (
    <>
        <div className={styles.messageBubble}>
            <div className={styles.messageInfo}>
                <h4>{name}</h4>
                <p>{datetime}</p>
            </div>
            <div className={styles.messageContent}>
                <p>{content}</p>
            </div>
        </div>
    </>
  )
}

export default MessageBubble
