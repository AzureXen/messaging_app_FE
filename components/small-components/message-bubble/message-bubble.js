import React, {useState} from 'react'
import styles from "./message-bubble.module.css"
import {groqTranslate} from "@/services/groqAIService";

const MessageBubble = ({name, datetime, content}) => {
    //Formatting time
    const dateObj = new Date(datetime);

    const [message, setMessage] = useState(content);
    const [isTranslated, setIsTranslated] = useState(false);

    // 2. Format it (Example: "12/23/2025, 8:29 AM")
    const formattedTime = dateObj.toLocaleString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleTranslateClick = async () => {
        if(!isTranslated) {
            setIsTranslated(true);
            try{
                const response = await groqTranslate(message);
                console.log("Received translation: ", response.data.translateResult);
                setMessage(response.data.translateResult);

            }catch(erm){
                console.error("error while fetching for translation", erm);
            }
        }
    };

  return (
    <>
        <div className={styles.messageBubble}>
            <div className={styles.messageInfo}>
                <h4>{name}</h4>
                <p>{formattedTime}</p>
                {isTranslated && (
                    <span className={styles.translatedIndicator}>
                        - translated by groq AI
                    </span>
                )}
            </div>
            <div className={styles.messageContent}>
                <p>{message}</p>
            </div>
            <button 
                className={styles.translateButton} 
                onClick={handleTranslateClick}
                title={isTranslated ? "Already translated" : "Translate"}
                aria-label="Translate message"
                disabled={isTranslated}
            >
                <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M5 8h14M5 8a5 5 0 0 0 5 5m-5-5a5 5 0 0 1 5-5m4 10l3 3m0 0l3-3m-3 3V8" />
                    <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
                </svg>
            </button>
        </div>
    </>
  )
}

export default MessageBubble
