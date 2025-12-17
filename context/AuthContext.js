'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth.js';
import {useRouter} from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            console.log("token from localStorage", token);
            if (token) {
                try {
                    console.log("running getMe()...");
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        console.log("Token is invalid or expired. Logging out...");
                        localStorage.removeItem('token');
                        setUser(null);
                    } else {
                        console.log("Error while running getMe()");
                    }
                }
            }
            else{
                console.log("No token found. redirecting to /login");
                router.push("/login");
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        console.log("User: ", user);
    }, [user])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);