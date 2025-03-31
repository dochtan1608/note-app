import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotesPage.module.css";

interface User {
  email: string;
  _id: string;
}

interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutClicked: () => void;
}

const NavBar = ({
  loggedInUser,
  onSignUpClicked,
  onLoginClicked,
  onLogoutClicked,
}: NavBarProps) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/">Home</Link>
      </div>

      <div className={styles.navCenter}>
        {loggedInUser && <Link to="/notes">My Notes</Link>}
      </div>

      <div className={styles.navRight}>
        {loggedInUser ? (
          <button className={styles.navButton} onClick={onLogoutClicked}>
            Logout
          </button>
        ) : (
          <>
            <button className={styles.navButton} onClick={onLoginClicked}>
              Login
            </button>
            <button className={styles.navButton} onClick={onSignUpClicked}>
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
