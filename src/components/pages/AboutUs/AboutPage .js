import React from "react";
import classes from "../AboutUs/AboutPage.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LogoImg from "../../../images/LogoImg.png";

const AboutPage = () => {
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
      <div className={classes["about-container"]}>
        <h1 className={classes["about-title"]}>Pitbull NFT Shop</h1>
        <p className={classes["about-text"]}>
          Welcome to Pitbull NFT Shop, the premier destination for discerning
          Pitbull enthusiasts and NFT collectors.
        </p>
        <p className={classes["about-text"]}>
          At Pitbull NFT Shop, we are driven by our passion for Pitbulls and the
          limitless possibilities of blockchain technology. Our platform unites
          these two worlds, offering you a gateway to a world of unique
          Pitbull-inspired NFTs.
        </p>
        <p className={classes["about-text"]}>
          Our mission is clear: we aim to bring Pitbull lovers and NFT
          connoisseurs together. We recognize the extraordinary bond between
          humans and Pitbulls, and our NFTs aim to capture the essence and
          splendor of these remarkable dogs.
        </p>
        <p className={classes["about-text"]}>
          What sets us apart is our commitment to curating a diverse collection
          of Pitbull NFTs. From digital art that portrays the majesty of
          Pitbulls to virtual collectibles that celebrate their uniqueness, our
          NFTs are meticulously selected to provide a captivating and valuable
          experience.
        </p>
        <p className={classes["about-text"]}>
          Thank you for joining the Pitbull NFT Shop community. We invite you to
          explore our exquisite NFT collection, engage with fellow Pitbull
          enthusiasts in our community forums, and be part of our shared
          passion.
        </p>
        <p className={classes["about-text"]}>
          Should you have any inquiries or feedback, please do not hesitate to
          <a href="/contact" className={classes["about-link"]}>
            <br></br>contact us
          </a>
          <br></br>. We are committed to ensuring that your journey with Pitbull
          NFTs is nothing short of extraordinary.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
