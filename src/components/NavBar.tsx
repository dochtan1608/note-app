import React from "react";
import { Container, Nav, Navbar as BootstrapNavbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/NotesPage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Define or import the User type
interface User {
  id: string;
  name: string;
  email: string;
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
    <BootstrapNavbar bg="light" expand="lg" className={styles.navbar}>
      <Container>
        <div className={styles.navLeft}>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
        </div>

        <div className={styles.navCenter}>
          {loggedInUser && (
            <Nav.Link as={Link} to="/notes">
              My Notes
            </Nav.Link>
          )}
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
      </Container>
    </BootstrapNavbar>
  );
};

export default NavBar;
