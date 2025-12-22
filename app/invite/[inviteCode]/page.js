'use client'
import React, {useEffect, useState} from 'react'
import {useParams, useRouter} from "next/navigation";
import {fetchInviteInfo, joinViaInvite} from "@/services/invites";
import Styles from "./page.module.css"
import {useAuth} from "@/context/AuthContext";

//TODO: Handle Invalid invite code (invite code not found)

const InvitePage = ({params}) => {
    const inviteCode = useParams().inviteCode;
    const [inviteInfo, setInviteInfo] = useState(null);
    const {user, loading} = useAuth();

    const router = useRouter();
    useEffect(() => {
        const getInviteInfo = async () =>{
            try{
                const response = await fetchInviteInfo(inviteCode);
                setInviteInfo(response.data);
                console.log(response.data);
            }catch(err){
                console.log("invite/inviteCode/page.js error: ", err);
            }
        }
        getInviteInfo();
    }, [inviteCode]);

  if (!inviteInfo) {
    return (
      <div className={Styles.invitePage}>
        <div className={Styles.card}>Loading…</div>
      </div>
    );
  }

  const { inviterName, conversationName, expired, maxUsageReached } = inviteInfo;

  const isValid = !expired && !maxUsageReached;

  const handleJoin = async () =>{
      try {
          if(user === null){
              if(loading) {
                  console.log("Hold on partner.");
              }
              else{
                  console.log("you aint got no token daug, moving u to login page");
                  router.push("/login");
                  return;
              }
          }
        const response = await joinViaInvite(inviteCode);
          const conversationId = response.data.conversationId;
          router.push(`/channels/${conversationId}`);
          console.log(response);
      }catch(error){
          console.error("handleJoin error: ", error);
      }
  }

  return (
    <div className={Styles.invitePage}>
      <div className={Styles.card}>
        {isValid ? (
          <>
            <h1 className={Styles.title}>You are invited to “{conversationName}”!</h1>
            <p className={Styles.subtitle}>by {inviterName}</p>
            <button className={Styles.joinBtn}
                onClick={handleJoin}
            >Join</button>
          </>
        ) : (
          <>
            <h1 className={Styles.title}>Nooo:(</h1>
            <p className={Styles.errorMsg}>
              {isExpired && 'This invitation has expired!'}
              {!isExpired && isMaxedComputed && 'This invitation has reached its maximum number of uses!'}
                gotta ask them for a new invitation...
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default InvitePage
