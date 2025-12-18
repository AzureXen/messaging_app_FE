import { createContext, useContext } from 'react';


const ConversationContext = createContext(null);


export const useConversations = () => {
    return useContext(ConversationContext);
};

export default ConversationContext;