import React, { useState, useEffect, useContext } from "react";
import { getOrderDetails, closePendingOrders } from "../../services/api";
import AddressComponent from "./AddressComponent";
import AuthContext from "../../context/AuthProvider";
import TotalPrice from "./TotalPrice";
import PaymentButton from "./PaymentButton";
import styles from "./OrderProcessPage.module.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoImg from "../../images/LogoImg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const OrderProcessPage = (setItemQuantities, itemQuantities, orders) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [userShippingAddress, setUserShippingAddress] = useState("");
  const [isAddressValid, setIsAddressValid] = useState(false);

  useEffect(() => {
    setIsAddressValid(userShippingAddress.trim().length > 0);
  }, [userShippingAddress]);

  const navigateToHome = () => {
    navigate("/");
  };

  const user = auth;
  useEffect(() => {
    const orderId = location.state?.orderId;
    if (orderId && user) {
      getOrderDetails(orderId)
        .then((response) => {
          setPendingOrder(response.data);
        })
        .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [user, location.state]);

  if (!pendingOrder) {
    return <div className={styles.noOrder}>No pending order to display.</div>;
  }

  const importImage = (imageName) => {
    try {
      return require(`../../images/${imageName}.png`);
    } catch (err) {
      console.error("Error importing image: ", err);
      return null;
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

  const handlePayment = () => {
    if (!pendingOrder) {
      console.log("No pending order to finalize.");
      return;
    }

    if (!userShippingAddress || userShippingAddress.trim() === "") {
      window.alert(
        "Please enter a valid shipping address before proceeding to payment."
      );
      return;
    }

    if (window.confirm("Are you sure you want to Proceed to Payment?")) {
      closePendingOrders(pendingOrder.orderId, userShippingAddress)
        .then(() => {
          window.alert(
            "We're excited to let you know that your payment has been successfully processed!"
          );

          setTimeout(() => {
            navigate("/orders");
          }, 1000);
        })
        .catch((error) => {
          console.error("Error finalizing order:", error);
          window.alert("Failed to finalize the order. Please try again.");
        });
    }
  };

  const closeSuccessMessage = () => {
    setShowSuccessMessage(false);
    navigate("/");
  };

  const handleAddressChange = (newAddress) => {
    setUserShippingAddress(newAddress);
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
      <div className={styles.orderProcessPage}>
        <h2>Pending Order Details</h2>
        <div className={styles.itemsList}>
          {pendingOrder.items.map((item) => (
            <div key={item.itemId} className={styles.item}>
              {showSuccessMessage && (
                <div className={styles.successMessage}>
                  Your payment was successful, and your order is on its way!
                  <button onClick={closeSuccessMessage}>OK</button>
                </div>
              )}
              <div className={styles.itemDetail}>
                <img
                  src={getSpecificPhotoById(item.item.id)}
                  alt={item.item.name}
                  className={styles.itemPhoto}
                />
                <div className={styles.itemInfo}>
                  <h3>{item.item.name}</h3>
                  <p>Price: ${item.item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TotalPrice items={pendingOrder.items} />
        <AddressComponent
          address={userShippingAddress}
          onAddressChange={handleAddressChange}
        />

        <PaymentButton
          onFinalizeOrder={handlePayment}
          setItemQuantities={setItemQuantities}
          itemQuantities={itemQuantities}
          orders={orders}
          pendingOrder={pendingOrder}
          disabled={!isAddressValid}
        />
      </div>
    </>
  );
};

export default OrderProcessPage;
