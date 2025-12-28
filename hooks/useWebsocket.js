// src/hooks/useWebSocket.js
import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (conversationId) => {
    const [messages, setMessages] = useState([]); // Store chat history
    const [isConnected, setIsConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        // 1. Get Token from Storage
        const token = localStorage.getItem("token"); // Make sure key matches your login logic!

        if (!token) {
            console.warn("No JWT found. Cannot connect.");
            return;
        }

        // 2. Create the Client
        const client = new Client({
            // If you use SockJS, you often need a factory:
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

            // 🛑 THE PROSTHETIC HEADER (The Secret Sauce)
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },

            // Life-cycle events
            onConnect: () => {
                console.log("✅ WebSocket Connected!");
                setIsConnected(true);

                // 3. Subscribe to the specific conversation topic
                // Backend: @SendTo("/topic/conversation/{id}")
                client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
                    if (message.body) {
                        const newMessage = JSON.parse(message.body);
                        // Add new message to the list
                        console.log("new message arrvied!: ", newMessage);
                        setMessages((prev) => [...prev, newMessage]);
                    }
                });
            },

            onDisconnect: () => {
                console.log("🛑 Disconnected");
                setIsConnected(false);
            },

            onStompError: (frame) => {
                console.error('❌ Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        // 4. Activate connection
        client.activate();
        clientRef.current = client;

        // Cleanup on unmount (User leaves page)
        return () => {
            client.deactivate();
        };
    }, [conversationId]); // Re-connect if conversationId changes

    // 5. Function to Send Message
    const sendMessage = (content) => {
        if (clientRef.current && isConnected) {
            const payload = { content: content }; // Add other fields if needed

            // Backend: @MessageMapping("/sendMessage/conversation/{id}")
            // Prefix: /app
            clientRef.current.publish({
                destination: `/app/sendMessage/conversation/${conversationId}`,
                body: JSON.stringify(payload),
            });
        } else {
            console.error("Cannot send message: WebSocket is disconnected.");
        }
    };

    return { messages, sendMessage, isConnected };
};