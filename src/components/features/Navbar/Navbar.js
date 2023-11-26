import React, { useContext } from "react";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";
import SearchBar from "../SearchBar/SearchBar";
import AuthContext from "../../../context/AuthProvider";
import { deleteUser } from "../../../services/api";
import {
  faShoppingCart,
  faUserMinus,
  faSignOutAlt,
  faHeart,
  faUserPlus,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Navbar({ isLoggedIn, setFavoriteItems, itemQuantities, setOrders }) {
  const navigate = useNavigate();

  const { setIsLoggedIn, setAuth, auth } = useContext(AuthContext);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuth("");
    setFavoriteItems([]);
    setOrders([]);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      try {
        await deleteUser(auth.user.sub);
        handleLogout();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const getTotalItems = () => {
    if (!itemQuantities || Object.keys(itemQuantities).length === 0) {
      return 0;
    }
    return Object.values(itemQuantities).reduce(
      (total, quantity) => total + quantity,
      0
    );
  };

  return (
    <>
      <nav className={classes.nav}>
        <SearchBar />
        {isLoggedIn && (
          <ul className={classes.navList}>
            <li className={classes.navItem}>
              <Link to="/favoritesListsItems">
                Favorites
                <FontAwesomeIcon icon={faHeart} />
              </Link>
            </li>
            <li className={classes.navItem}>
              <Link to="/orders">
                ShoppingCart
                <FontAwesomeIcon icon={faShoppingCart} />
                {getTotalItems() > 0 && (
                  <span className={classes.cartBadge}>{getTotalItems()}</span>
                )}
              </Link>
            </li>
            <li onClick={handleDeleteAccount} className={classes.actionLink}>
              Delete User
              <FontAwesomeIcon icon={faUserMinus} />
            </li>
            <li onClick={handleLogout} className={classes.actionLink}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </li>
          </ul>
        )}
        {!isLoggedIn && (
          <ul className={classes.navList}>
            <CustomLink to="/login" className={classes.actionLink}>
              <FontAwesomeIcon icon={faSignInAlt} />
              Login
            </CustomLink>
            <CustomLink to="/signUp" className={classes.actionLink}>
              <FontAwesomeIcon icon={faUserPlus} className="fa-regular" />
              Sign-Up
            </CustomLink>
          </ul>
        )}
      </nav>
    </>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? classes.active : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
