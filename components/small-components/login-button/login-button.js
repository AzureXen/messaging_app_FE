'use client'
import React from 'react'
import {useRouter} from "next/navigation";
import styles from "./login-button.module.css"
import {useAuth} from "@/context/AuthContext";
const LoginButton = () => {
    const router = useRouter();
    const {user} = useAuth();
  return (
      <button className={styles.loginButton}
              onClick={() => {
                  router.push(`${user==null ? "/login" : "/channels"}`);
              }}
      >
          {user==null ? "Log in" : "Join back"}
      </button>
  )
}

export default LoginButton
