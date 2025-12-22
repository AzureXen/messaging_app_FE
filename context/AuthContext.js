'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/auth.js';
import {useRouter, usePathname} from "next/navigation";

const AuthContext = createContext();

const PUBLIC_ROUTES = ['/login', '/register', '/', '/invite/*'];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const isPublicRoute = (path) => {
                return PUBLIC_ROUTES.some(route => {
                    if (route === path) return true;
                    if (route.endsWith('/*')) {
                        const baseRoute = route.slice(0, -1);
                        return path.startsWith(baseRoute);
                    }
                    return false;
                });
            };
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        console.log("Token is invalid or expired. Logging out...");
                        localStorage.removeItem('token');
                        setUser(null);
                        console.log("auth context: pushing login");
                        router.push("/login");
                    } else {
                        console.log("Error while running getMe()");
                    }
                }
            }
            else{
                if (isPublicRoute) {
                    // Do nothing! Let them see the landing/register page.
                    console.log("No token, but on public route. Allowed.");
                } else {
                    // They are trying to access a protected page. Kick them out.
                    console.log("No token found. Redirecting to /login");
                    router.push("/login");
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);