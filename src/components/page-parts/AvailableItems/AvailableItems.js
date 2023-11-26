import React, { useState, useEffect, useCallback } from "react";
import classes from "./AvailableItems.module.css";
import {
  faHeart,
  faShoppingCart,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  addToFavorite,
  getUserOrders,
  addItemToOrder,
  getAllItems,
  removeItemFromOrder,
} from "../../../services/api";

const AvailableItems = ({
  setItems,
  items,
  user,
  pendingOrderId,
  setOrders,
  setPendingOrderId,
  isLoggedIn,
  itemQuantities,
  setItemQuantities,
  setFavoriteItems,
  favoriteItems,
}) => {
  const userName = user.user && user.user.sub;
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItems = () => {
      if (userName) {
        getAllItems({ userName })
          .then((response) => {
            setItems(response.data);
          })
          .catch((error) => {
            console.error("Error fetching items:", error);
          });
      }
    };

    fetchItems();
  }, [userName, setItems]);

  const importImage = (imageName) => {
    try {
      return require(`../../../images/${imageName}.png`);
    } catch (err) {
      console.error("Error importing image: ", err);
      return null;
    }
  };

  const handleAddToFavorite = async (itemId) => {
    if (!isLoggedIn) {
      console.error("User is not logged in");
      return;
    }

    if (favoriteItems.includes(itemId)) {
      setMessage("This item is already in your favorites.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const itemToAdd = items.find((item) => item.id === itemId);
      if (!itemToAdd) {
        console.error("Item not found");
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
      setFavoriteItems([...favoriteItems, itemToAdd.id]); // Update favorite items with the correct itemId

      setMessage(`${favoriteItem.item.name} added to favorites!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error handling favorite:", error);
    }
  };

  const specificImages = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    photo: importImage(`item${index + 1}`),
  }));

  const getSpecificPhotoById = (itemId) => {
    const specificImage = specificImages.find((image) => image.id === itemId);
    return specificImage ? specificImage.photo : "../images/default.jpg";
  };

  const updateOrdersAndItems = useCallback(() => {
    getUserOrders(userName)
      .then((response) => {
        setOrders(response.data);
        const updatedPendingOrder = response.data.find(
          (order) => order.orderStatus === "PENDING"
        );

        if (updatedPendingOrder) {
          setPendingOrderId(updatedPendingOrder.orderId);
          const newQuantities = {};
          updatedPendingOrder.items.forEach((item) => {
            newQuantities[item.itemId] = item.quantity;
          });
          setItemQuantities(newQuantities);
        } else {
          setPendingOrderId(null);
          if (!pendingOrderId) {
            setItemQuantities({});
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching updated orders:", error);
      });
  }, [
    userName,
    pendingOrderId,
    setItemQuantities,
    setOrders,
    setPendingOrderId,
  ]);

  useEffect(() => {
    updateOrdersAndItems();
  }, [updateOrdersAndItems]);

  const handleAddItemToOrder = (item) => {
    if (!user || !item.id) {
      console.error("Authentication context is not set properly.");
      return;
    }
    const orderFunction = pendingOrderId
      ? addItemToOrder(userName, item)
      : addItemToOrder(userName, item, "PENDING");

    orderFunction
      .then((response) => {
        updateOrdersAndItems();
      })
      .catch((error) => {
        console.error("Error updating/creating order:", error);
      });
  };

  const handleAddToCart = (item) => {
    const existingQuantity = itemQuantities[item.id] || 0;
    const quantityToAdd = 1;

    if (item.stock === 0) {
      setMessage(`Sorry, ${item.name} is currently out of stock.`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (existingQuantity + quantityToAdd > item.stock) {
      setMessage(
        `Sorry, only ${item.stock} units of ${item.name} are available.`
      );
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item.id]: existingQuantity + quantityToAdd,
    }));

    handleAddItemToOrder({
      ...item,
      quantity: existingQuantity + quantityToAdd,
    });
    setMessage(`${item.name} added to cart!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRemoveItemFromOrder = (itemId) => {
    const existingQuantity = itemQuantities[itemId];

    if (!existingQuantity || existingQuantity <= 0) {
      setMessage("No items to remove from the order.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const newQuantity = existingQuantity - 1;
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity > 0 ? newQuantity : 0,
    }));

    if (newQuantity > 0) {
      handleAddItemToOrder({ id: itemId, quantity: newQuantity });
    } else {
      removeItemFromOrder(pendingOrderId, itemId)
        .then(() => {
          setMessage("Item removed from cart.");
          setTimeout(() => setMessage(""), 3000);
          updateOrdersAndItems();
        })
        .catch((error) => {
          console.error("Error removing item from order:", error);
        });
    }
  };

  const [hoveredItemId, setHoveredItemId] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredItemId(id);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };



  return (
    <>
      {message && <div className={classes["message-box"]}>{message}</div>}
      <div className={classes["available-items"]}>
        {items.map((item) => (
          <div key={item.id} className={classes["item-card"]}>
            <img src={getSpecificPhotoById(item.id)} alt={item.name} />
            <h3>{item.name}</h3>
            <p>Price: ${item.price}</p>
            <p>Available: {item.stock} items</p>
            {isLoggedIn && item && itemQuantities && (
              <p >Items in Cart: {itemQuantities[item.id] || 0}</p>
            )}
            <div
              className={classes["description-circle"]}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              !
            </div>
            {hoveredItemId === item.id && (
              <div className={classes["description-box"]}>{item.photo}</div>
            )}

            {isLoggedIn && (
              <>
                <button
               className={classes.faHeart}
               key={item.id}
               aria-label={`Add ${item.name} to favorites`}
               onClick={() => handleAddToFavorite(item.id)}
             >
               <FontAwesomeIcon icon={faHeart} className="faHeart" />
              </button>

                <button
                  className={classes.faTrash}
                  aria-label={`Remove ${item.name} from cart`}
                  onClick={() => handleRemoveItemFromOrder(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>

                <button
                 className={classes.faShoppingCart}
                  aria-label={`Add ${item.name} to cart`}
                  onClick={() => handleAddToCart(item)}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default AvailableItems;
