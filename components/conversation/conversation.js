import React from 'react'
import Styles from "./conversation.module.css"
const Conversation = ({name, lastMessage}) => {
  return (
    <div className={Styles.conversation}>
        <h3>{name}</h3>
        <p>{lastMessage}</p>
    </div>
  )
}

export default Conversation
