import React, { useState, useEffect } from "react";
import styles from "./OrderProcessPage.module.css";

const AddressComponent = ({ address, onAddressChange, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState(address);

  useEffect(() => {
    setNewAddress(address);
  }, [address]);

  const handleEditClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleSaveClick = () => {
    onAddressChange(newAddress);
    setIsEditing(false);
  };

  const handleAddressInput = (e) => {
    setNewAddress(e.target.value);
  };

  return (
    <div className={styles.addressComponent}>
      <h3>Shipping Address:</h3>
      {!isEditing ? (
        <>
          <p>{address || "No address provided"}</p>
          <button onClick={handleEditClick} disabled={disabled}>
            Edit Address
          </button>
        </>
      ) : (
        <>
          <textarea
            value={newAddress}
            onChange={handleAddressInput}
            rows="1"
            className={styles.textarea}
            disabled={disabled}
          />
          <button
            className={styles.addressButton}
            onClick={handleSaveClick}
            disabled={!newAddress.trim()}
          >
            Save Address
          </button>
        </>
      )}
    </div>
  );
};

export default AddressComponent;
