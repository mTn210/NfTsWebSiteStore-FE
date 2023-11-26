import React, { useState } from "react";
import classes from "./ContactPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import LogoImg from "../../../images/LogoImg.png";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendFeedbackToServer(formData);
      setSuccessMessage(
        formData.name +
          " Your feedback with mail: " +
          formData.email +
          ` successfully submitted: ` +
          formData.message
      );

    
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending feedback:", error);
      setSuccessMessage("Failed to submit feedback. Please try again.");
    }
  };

  const sendFeedbackToServer = async (formData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <button className={classes.backButton} onClick={navigateToHome}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Go to Home
      </button>
      <img src={LogoImg} alt="Logo" className={classes.imgg} />
      <div className={classes.contactContainer}>
        <h1>Contact Us</h1>
        <p>
          If you have any questions or feedback, please feel free to reach out
          to us using the form below:
        </p>
        {successMessage && (
          <div className={classes.successMessage}>{successMessage}</div>
        )}
        <form className={classes.contactForm} onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              placeholder="Your Name..."
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              placeholder="Your Email..."
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea
              placeholder=" questions or feedback here..."
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <button type="submit" className={classes.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
