'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { register as registerUser, getMe } from '../../services/auth.js';
import styles from './page.module.css';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      };

      const res = await registerUser(payload);
      const token = res?.data?.token ?? res?.token;
      if (!token) {
        throw new Error('Registration response missing token');
      }

      localStorage.setItem('token', token);

      try {
        const me = await getMe();
        const user = me?.data ?? me;
        if (user) setUser(user);
      } catch (e) {
        console.warn('Failed to fetch user after register', e);
      }

      router.push('/channels');
    } catch (err) {
      console.error(err);
      const apiMessage = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setError(apiMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Create your account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="userName"
            type="text"
            placeholder="userName"
            value={formData.userName}
            onChange={handleChange}
            required
            className={styles.input}
            autoComplete="userName"
            minLength={3}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            autoComplete="email"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.input}
            autoComplete="new-password"
            minLength={6}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={styles.input}
            autoComplete="new-password"
            minLength={6}
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.registerButton} disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
