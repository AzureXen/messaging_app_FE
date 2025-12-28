import React from 'react'
import Styles from "./conversation.module.css"
import {useRouter} from "next/navigation";
const Conversation = ({name, lastMessage, id}) => {
    const router = useRouter();
  return (
    <div className={Styles.conversation} onClick={() => router.push(`/channels/${id}`)} title={name}>
        <h3 title={name}>{name}</h3>
        <p title={lastMessage || ''}>{lastMessage}</p>
    </div>
  )
}

export default Conversation
