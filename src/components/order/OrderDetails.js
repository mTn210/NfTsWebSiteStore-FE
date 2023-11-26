import React from "react";
import styles from "../order/OrderList.module.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderDetails = ({ order, onRemoveItem, disabled }) => {
  return (
    <div className={styles.orderItem}>
      <ul className={styles.itemList}>
        {order.items.map((item) => (
          <li key={item.itemId} className={styles.listItem}>
            <ul>{item.item.name}</ul>
            <ul>
              ${item.item.price} x Quantity: {item.quantity || "Not set"}
            </ul>
            <button
              className={styles.trashbutton}
              onClick={() => onRemoveItem(order.orderId, item.itemId)}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;
