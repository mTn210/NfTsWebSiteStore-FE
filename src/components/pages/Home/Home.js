import React, { useContext } from "react";
import Navbar from "../../features/Navbar/Navbar.js";
import AvailableItems from "../../page-parts/AvailableItems/AvailableItems";
import AuthContext from "../../../context/AuthProvider";
import LogoImg from "../../../images/LogoImg.png";
import classes from "../Home/Home.module.css";
import NavbarContact from "../../features/NavbarContacts/NavbarContact.js";


function Home({
  handleAddItemToOrder,
  items,
  searchResult,
  pendingOrderId,
  setOrders,
  setPendingOrderId,
  setFavoriteItems,
  setItems,
  setItemQuantities,
  itemQuantities,
  noResults,
  searchTerm,
  favoriteItems,
  orders,
}) {
  const { auth, isLoggedIn } = useContext(AuthContext);

  return (
    <>
      {isLoggedIn && auth.user && (
        <h5 className={classes.logo}>Hello, {auth.user.sub}</h5>
      )}
        <Navbar
        isLoggedIn={isLoggedIn}
        user={auth}
        handleAddItemToOrder={handleAddItemToOrder}
        setFavoriteItems={setFavoriteItems}
        searchTerm={searchTerm}
        noResults={noResults}
        itemQuantities={itemQuantities}
        favoriteItems={favoriteItems}
        setOrders={setOrders}
        setItems={setItems}
        orders={orders}
        setItemQuantities={setItemQuantities}
        pendingOrderId={pendingOrderId}
        items={items}
      />
     
      <div></div>
      <img src={LogoImg} alt="Logo" className={classes.imgg} />
      <AvailableItems
        items={searchResult.length > 0 ? searchResult : items}
        isLoggedIn={isLoggedIn}
        user={auth}
        pendingOrderId={pendingOrderId}
        setOrders={setOrders}
        setPendingOrderId={setPendingOrderId}
        setItems={setItems}
        setItemQuantities={setItemQuantities}
        itemQuantities={itemQuantities}
        orders={orders}
        favoriteItems={favoriteItems}
        setFavoriteItems={setFavoriteItems}
      />
      <NavbarContact/>
    </>
  );
}

export default Home;
