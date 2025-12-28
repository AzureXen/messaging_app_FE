'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { login, getMe } from '../../services/auth.js';
import styles from './page.module.css';

import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();


    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await login(formData);
            const token = data?.token ?? data?.data?.token;

            if (!token) {
                throw new Error('Login response missing token');
            }

            localStorage.setItem('token', token);

            try {
                const me = await getMe();
                const user = me?.data ?? me;
                if (user) setUser(user);
            } catch (e) {
                console.warn('Failed to fetch user after login', e);
            }

            router.push('/channels');

        } catch (err) {
            console.error(err);
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Welcome Back!</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className={styles.footerText}>
                    Need an account? <Link href="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}