'use client'
import React, { useEffect } from 'react'
import { useConversations } from "@/context/ConversationContext";
import { useRouter } from "next/navigation";

const Channels = () => {
    const allConversations = useConversations();
    const router = useRouter();

    useEffect(() => {
        if (allConversations === null) return;

        if (allConversations.length > 0) {
            const firstChatId = allConversations[0].id;
            router.push(`/channels/${firstChatId}`);
        }


    }, [allConversations, router]);

    if (allConversations === null) {
        return <div className="loading-screen">Loading your world...</div>;
    }

    if (allConversations.length === 0) {
        return (
            <div className="empty-state">
                <h1>Welcome!</h1>
                <p>You don't have any conversations yet.</p>
                <button onClick={() => console.log("Open create modal")}>
                    Create your first Channel
                </button>
            </div>
        );
    }
    return <div>Redirecting...</div>;
}

export default Channels