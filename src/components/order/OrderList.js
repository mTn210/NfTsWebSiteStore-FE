import React, { useState, useEffect, useContext } from "react";
import OrderDetails from "./OrderDetails";
import TotalPrice from "./TotalPrice";
import styles from "./OrderList.module.css";
import { removeItemFromOrder, getUserOrders } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/AuthProvider";
import LogoImg from "../../images/LogoImg.png";

const OrderList = ({ setOrders, itemQuantities, setItemQuantities }) => {
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const goToOrderProcess = (orderId) => {
    navigate("/order-process", { state: { orderId } });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (auth.user && auth.user.sub) {
        setLoading(true);
        try {
          const response = await getUserOrders(auth.user.sub);
          setUpdatedOrders(response.data);
          const pendingOrder = response.data.find(
            (order) => order.orderStatus === "PENDING"
          );
          setPendingOrderId(pendingOrder ? pendingOrder.orderId : null);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [auth.user, setLoading, setOrders]);

 

  const handleRemoveItem = async (orderId, itemId) => {
    if (!itemId) {
      console.error("Item ID is undefined");
      return;
    }

    try {
      await removeItemFromOrder(orderId, itemId);
      const order = updatedOrders.find((o) => o.orderId === orderId);
      const isLastItem =
        order && order.items.length === 1 && order.items[0].itemId === itemId;

      const updatedOrdersAfterRemoval = updatedOrders.map((order) => {
        if (order.orderId === orderId) {
          const newItems = order.items.filter((item) => item.itemId !== itemId);
          return { ...order, items: newItems };
        }
        return order;
      });

      setUpdatedOrders(updatedOrdersAfterRemoval);

      if (itemQuantities[itemId] && itemQuantities[itemId] > 0) {
        setItemQuantities((prevQuantities) => ({
          ...prevQuantities,
          [itemId]: prevQuantities[itemId] - 1,
        }));
      }

      setMessage("Item removed successfully.");
      setTimeout(() => setMessage(""), 3000);

      if (isLastItem) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setMessage("Failed to remove item. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      <div>
        <button className={styles.backButton} onClick={navigateToHome}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Go to Home
        </button>
        <img src={LogoImg} alt="Logo" className={styles.imgg} />
      </div>
      {loading && <div>Loading orders...</div>}
      {!loading && updatedOrders.length === 0 ? (
        <div className={styles.centeredMessage}>
          <p>No items in Cart.</p>
        </div>
      ) : (
        <div className={styles.orderList}>
          {message && <div className={styles.message}>{message}</div>}
          {updatedOrders.map((order) => {
            const isOrderClosed = order.orderStatus === "CLOSED";
            const orderClass = isOrderClosed
              ? styles.orderClosed
              : styles.orderPending;
            return (
              <div
                key={order.orderId}
                className={`${styles.order} ${orderClass}`}
              >
                <p>Status: {order.orderStatus}</p>
                <p>
                  Order Date: {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p>Shipping-Address: {order.shippingAddress}</p>
                <h4>Items:</h4>
                <OrderDetails
                  order={order}
                  itemQuantities={itemQuantities}
                  onRemoveItem={handleRemoveItem}
                  disabled={isOrderClosed}
                />
                
                <TotalPrice
                  items={order.items}
                  itemQuantities={itemQuantities}
                />
                <button
                  onClick={() => goToOrderProcess(order.orderId)}
                  className={`${styles.backButton} ${
                    order.orderStatus === "CLOSED" ? styles.inactive : ""
                  }`}
                  disabled={order.orderId !== pendingOrderId || isOrderClosed}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default OrderList;
