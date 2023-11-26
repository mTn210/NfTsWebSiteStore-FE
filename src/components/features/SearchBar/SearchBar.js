import React, { useState, useEffect, useContext } from "react";
import { searchItems, addItemToOrder, addToFavorite } from "../../../services/api";
import classes from "./SearchBar.module.css";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../../context/AuthProvider";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [message, setMessage] = useState("");
  const { isLoggedIn, auth } = useContext(AuthContext);
  const userName = auth.user && auth.user.sub;

  useEffect(() => {
    if (searchTerm) {
      searchItems(searchTerm)
        .then((response) => {
          if (response.data.length === 0) {
            setNoResultsMessage("No items found.");
          } else {
            setSearchResults(response.data);
            setNoResultsMessage("");
          }
        })
        .catch((error) => {
          console.error("Error searching items:", error);
          setNoResultsMessage("Failed to fetch items");
        });
    } else {
      setSearchResults([]);
      setNoResultsMessage("");
    }
  }, [searchTerm]);

  const handleAddToFavorite = async (itemId) => {
    if (!isLoggedIn) {
      setMessage("User is not logged in");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const itemToAdd = searchResults.find((item) => item.id === itemId);
      if (!itemToAdd) {
        setMessage("Item not found");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const favoriteItem = {
        userName,
        itemId: itemToAdd.id,
        item: {
          id: itemToAdd.id,
          name: itemToAdd.name,
          photo: itemToAdd.photo,
          price: itemToAdd.price,
          stock: itemToAdd.stock,
        },
      };

      await addToFavorite(favoriteItem);
      setMessage(`${itemToAdd.name} added to favorites!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error handling favorite:", error);
      setMessage("Failed to add item to favorites.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAddToOrder = async (item) => {
    if (!isLoggedIn) {
      setMessage("User is not logged in");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const itemData = {
        id: item.id,
        name: item.name,
        photo: item.photo,
        price: item.price,
        stock: item.stock,
      };

      await addItemToOrder(auth.user.sub, itemData);
      setMessage(`${item.name} added to order successfully.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding item to order:", error);
      setMessage("Failed to add item to order.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className={classes.search}>
      <input
        type="text"
        placeholder="Search Items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchResults.length > 0 && (
        <ul className={classes.searchResults}>
          {searchResults.map((item) => (
            <li key={item.id}>
              {isLoggedIn && (
                <button
                  className={classes.button}
                  onClick={() => handleAddToFavorite(item.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              )}
              {isLoggedIn && (
                <button
                  className={classes.button}
                  onClick={() => handleAddToOrder(item)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              )}
              <div>
                {" "}
                {item.name}: ${item.price}
              </div>
            </li>
          ))}
        </ul>
      )}
      {noResultsMessage && (
        <div
          className={`${classes.noResults} ${
            noResultsMessage ? classes.visible : ""
          }`}
        >
          {noResultsMessage}
        </div>
      )}
      {message && <p className={classes.message}>{message}</p>}
    </div>
  );
};

export default SearchBar;
