'use client'
import React from 'react'
import {useRouter} from "next/navigation";
import styles from "./login-button.module.css"
const LoginButton = () => {
    const router = useRouter();
  return (
      <button className={styles.loginButton}
              onClick={() => {
                  router.push('/login');
              }}
      >
          Login
      </button>
  )
}

export default LoginButton
