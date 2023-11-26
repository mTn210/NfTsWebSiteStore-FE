import Register from "./components/registration/Register";
import Login from "./components/registration/Login";
import { Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import { AuthProvider } from "./context/AuthProvider";
import OrderProcessPage from "./components/order/OrderProcessPage";
import OrderList from "./components/order/OrderList";
import AuthContext from "./context/AuthProvider";
import AboutPage from "./components/pages/AboutUs/AboutPage ";
import ContactPage from "./components/pages/ContactUs/ContactPage";
import {
  fetchFavoriteItems,
  getAllItems,
  testAuthenticatedApi,

  
} from "./services/api";
import FavoriteItemsList from "./components/pages/Favorites/FavoriteItemsList";
import React, { useState, useEffect, useContext } from "react";



function App() {
  const [items, setItems] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const { auth, isLoggedIn, user } = useContext(AuthContext);
  const [testResponse, setTestResponse] = useState("");
  const [itemQuantities, setItemQuantities] = useState({});
 
  useEffect(() => {
    if (isLoggedIn && auth.token) {
      testAuthenticatedApi({ Authorization: "Bearer " + auth.token })
        .then((res) => setTestResponse(res.data.response))
        .catch((error) => console.error("Error:", error));
    }
  }, [auth, isLoggedIn]);

  useEffect(() => {
    getAllItems()
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  }, []);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isLoggedIn={isLoggedIn}
                user={user}
                orders={orders}
                items={items}
                searchResult={searchResult}
                pendingOrderId={pendingOrderId}
                setIsLoggedIn={setIsLoggedIn}
                favoriteItems={favoriteItems}
                auth={auth}
                testResponse={testResponse}
                setOrders={setOrders}
                setPendingOrderId={setPendingOrderId}
                setFavoriteItems={setFavoriteItems}
                setNoResults={setNoResults}
                setSearchResult={setSearchResult}
                setItems={setItems}
                setItemQuantities={setItemQuantities}
                itemQuantities={itemQuantities}
                noResults={noResults}
              />
            }
          />
          <Route
            path="/favoritesListsItems"
            element={
              <FavoriteItemsList
                favoriteItems={favoriteItems}
                fetchFavoriteItems={fetchFavoriteItems}
                auth={auth}
                setFavoriteItems={setFavoriteItems}
                items={items}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <OrderList
                setOrders={setOrders}
                isLoggedIn={isLoggedIn}
                setItemQuantities={setItemQuantities}
                itemQuantities={itemQuantities}
                user={user}
              />
            }
          />
          <Route
            path="/order-process"
            element={<OrderProcessPage
               
            itemQuantities={itemQuantities} />}
            setItemQuantities={setItemQuantities}
            orders={orders}
            setOrders={setOrders}
          />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} />} />
          <Route path="/signUp" element={<Register />} />
          
          <Route path="/about" element={<AboutPage/>} />
        <Route path="/contact" element={<ContactPage/>} />
         
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
