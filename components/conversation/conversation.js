import React from 'react'
import Styles from "./conversation.module.css"
import {useRouter} from "next/navigation";
const Conversation = ({name, lastMessage, id}) => {
    const router = useRouter();
  return (
    <div className={Styles.conversation} onClick={() => router.push(`/channels/${id}`)}>
        <h3>{name}</h3>
        <p>{lastMessage}</p>
    </div>
  )
}

export default Conversation
