import styles from "./page.module.css";
import LoginButton from "@/components/small-components/login-button/login-button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          Super epic landing page
          <LoginButton/>
      </main>
    </div>
  );
}
