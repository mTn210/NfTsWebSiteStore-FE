import React from "react";
import classes from "./OrderProcessPage.module.css";

const PaymentButton = ({ onFinalizeOrder }) => {
  return (
    <button className={classes.pay} onClick={onFinalizeOrder}>
      Proceed to Payment
    </button>
  );
};

export default PaymentButton;
