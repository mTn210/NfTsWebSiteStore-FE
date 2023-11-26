import React, { useEffect, useContext } from "react";
import classes from "./FavoriteItemsList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { fetchFavoriteItems, removeFavoriteItem } from "../../../services/api";
import AuthContext from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import LogoImg from "../../../images/LogoImg.png";

function FavoriteItemsList({ favoriteItems, setFavoriteItems }) {
  const { auth, isLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    if (isLoggedIn && auth && auth.user) {
      fetchFavoriteItems(auth.user.sub)
        .then((response) => {
          const itemsOnly = response.data.map((fav) => fav.item);
          setFavoriteItems(itemsOnly);
        })
        .catch((error) => {
          console.error("Error fetching favorite items:", error);
        });
    }
  }, [isLoggedIn, auth, setFavoriteItems]);

  const handleRemoveFavorite = async (itemId) => {
    try {
      await removeFavoriteItem(itemId);
      setFavoriteItems(favoriteItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error removing favorite item:", error);
    }
  };

  const importImage = (imageName) => {
    try {
      return require(`../../../images/${imageName}.png`);
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
    return specificImage ? specificImage.photo : null;
  };

  return (
    <div>
      <div>
        <button className={classes.backButton} onClick={navigateToHome}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Go to Home
        </button>
        <img src={LogoImg} alt="Logo" className={classes.imgg} />
      </div>

      <div className={classes.favoriteItemsList}>
        <ul>
          {favoriteItems && favoriteItems.length > 0 ? (
            favoriteItems.map((item, index) => (
              <li
                key={
                  item.id !== undefined
                    ? item.id
                    : `${item.name}-${item.price}-${index}`
                }
              >
                <img
                  src={getSpecificPhotoById(item.id)}
                  alt={`Item ${item.id}`}
                />
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Available: {item.stock} items</p>
                  <button
                    aria-label={`Remove ${item.name} from favorites`}
                    onClick={() => handleRemoveFavorite(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No favorite items available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default FavoriteItemsList;
