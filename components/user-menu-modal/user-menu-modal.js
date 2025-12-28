"use client";
import React, {useState} from "react";
import Styles from "./user-menu-modal.module.css";

const UserMenuModal = ({ open = false, onClose, onLogout, user }) => {

    const [revealEmail, setRevealEmail] = useState(false);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  if (!open) return null;

  const handleRevealEmail = () => {
      setRevealEmail(!revealEmail);
  }

  return (
    <div className={Styles.backdrop} onClick={handleBackdrop}>
      <div className={Styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={Styles.header}>Account</div>
        <div className={Styles.body}>

            <div className={Styles.userInfoBlock}>
                <div className={Styles.userInfo}>
                    <h4>Display name:</h4>
                    <p>{user.displayName}</p>
                </div>

                <div className={Styles.userInfo}>
                    <h4>Username:</h4>
                    <p>{user.userName}</p>
                </div>

                <div className={Styles.userInfo}>
                    <h4>Email:</h4>
                    <span>
                        <p>{revealEmail ? `${user.email}` : `**********`}</p>
                        <p className={Styles.revealEmail} onClick={handleRevealEmail}>
                            {revealEmail ? "hide" : "reveal"}
                        </p>
                    </span>
                </div>
            </div>

        </div>
        <div className={Styles.actions}>
          <button className={Styles.btn} onClick={() => onClose?.()}>Close</button>
          <button className={`${Styles.btn} ${Styles.btnPrimary}`} onClick={() => onLogout?.()}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserMenuModal;
