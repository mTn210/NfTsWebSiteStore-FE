import React from "react";
import styles from "./OrderComponents.module.css";

const TotalPrice = ({ items }) => {
  const calculateTotal = () => {
    if (!items) {
      return 0;
    }

    return items.reduce((acc, orderItem) => {
      const itemPrice = parseFloat(orderItem.item.price);
      const itemQuantity = orderItem.quantity || 0;

      if (!isNaN(itemPrice) && itemQuantity > 0) {
        return acc + itemPrice * itemQuantity;
      }
      return acc;
    }, 0);
  };

  const total = calculateTotal();

  return (
    <div className={styles.totalPrice}>
      <h3>Total Price: ${total.toFixed(2)}</h3>
    </div>
  );
};

export default TotalPrice;
