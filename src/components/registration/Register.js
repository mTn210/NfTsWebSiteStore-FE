import React, { useRef, useState, useEffect, Fragment } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Register.module.css";
import { createNewUser } from "../../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoImg from "../../images/LogoImg.png";


const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const NAMES_REGEX =
  /^[A-Za-zäöüß\u0590-\u05FF][A-Za-z\s0-9_!@#$%^&*()-+=äöüß\u0590-\u05FF]{1,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^05\d{8}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [country, setCountry] = useState("");
  const [countryFocus, setCountryFocus] = useState(false);

  const [city, setCity] = useState("");
  const [cityFocus, setCityFocus] = useState(false);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [welcomeMessage, setWelcomeMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidFirstName(NAMES_REGEX.test(firstName));
  }, [firstName]);
  useEffect(() => {
    setValidLastName(NAMES_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPhone(PHONE_REGEX.test(phone));
  }, [phone]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd, firstName, lastName, email, phone, country, city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);

    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const newUserBody = {
        username: user,
        password: pwd,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        country,
        city,
      };

      await createNewUser(newUserBody);

      setUser("");
      setPwd("");
      setMatchPwd("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setCity("");
      setWelcomeMessage(
        `Hi ${firstName}! Your account has been successfully created.`
      );
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 400) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <Fragment>
      <button className={classes.backButton} onClick={navigateToHome}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Go to Home
      </button>
      <img src={LogoImg} alt="Logo" className={classes.imgg} />
      {success ? (
        <section>
          <h1>{welcomeMessage}</h1>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? classes.errmsg : classes.offscreen}
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <br></br>
          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="username">
                Username:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validName ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validName || !user ? classes.hide : classes.invalid
                  }
                />
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                className={`${classes.input} ${
                  userFocus && user && !validName ? classes.invalid : ""
                }`}
              />
              <p
                id="uidnote"
                className={
                  userFocus && user && !validName
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="password">
                Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !pwd ? classes.hide : classes.invalid}
                />
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                className={`${classes.input} ${
                  pwdFocus && !validPwd ? classes.invalid : ""
                }`}
              />
              <p
                id="pwdnote"
                className={
                  pwdFocus && !validPwd
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters: <span>!</span>{" "}
                <span aria-label="at symbol">@</span> <span>#</span>{" "}
                <span>$</span> <span>%</span>
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="confirm_pwd" className={classes.label}>
                Confirm Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validMatch && matchPwd ? classes.valid : classes.hide
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validMatch || !matchPwd ? classes.hide : classes.invalid
                  }
                />
              </label>
              <input
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                className={`${classes.input} ${
                  matchFocus && !validMatch ? classes.invalid : ""
                }`}
              />
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="firstName">
                First Name:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validFirstName ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validFirstName || !firstName
                      ? classes.hide
                      : classes.invalid
                  }
                />
              </label>
              <input
                type="text"
                id="firstName"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
                onFocus={() => setFirstNameFocus(true)}
                onBlur={() => setFirstNameFocus(false)}
                className={`${classes.input} ${
                  firstNameFocus && firstName && !validFirstName
                    ? classes.invalid
                    : ""
                }`}
              />
              <p
                id="uidnote"
                className={
                  firstNameFocus && firstName && !validFirstName
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                First Name must be 2 to 23 characters.
                <br />
                and must contain letters only.
                <br />
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="lastName">
                Last Name:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validLastName ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validLastName || !firstName ? classes.hide : classes.invalid
                  }
                />
              </label>
              <input
                type="text"
                id="lastName"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
                onFocus={() => setLastNameFocus(true)}
                onBlur={() => setLastNameFocus(false)}
                className={`${classes.input} ${
                  lastNameFocus && lastName && !validLastName
                    ? classes.invalid
                    : ""
                }`}
              />
              <p
                id="uidnote"
                className={
                  lastNameFocus && lastName && !validLastName
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                First Name must be 2 to 23 characters.
                <br />
                and must contain letters only.
                <br />
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="email">
                Email:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validEmail || !email ? classes.hide : classes.invalid
                  }
                />
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                className={`${classes.input} ${
                  emailFocus && email && !validEmail ? classes.invalid : ""
                }`}
              />
              <p
                id="uidnote"
                className={
                  emailFocus && email && !validEmail
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.
                <br />
                Must Contain "example@exampleMail.com".
                <br />
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="phone">
                Phone:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPhone ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validPhone || !phone ? classes.hide : classes.invalid
                  }
                />
              </label>
              <input
                type="text"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
                onFocus={() => setPhoneFocus(true)}
                onBlur={() => setPhoneFocus(false)}
                className={`${classes.input} ${
                  phoneFocus && phone && !validPhone ? classes.invalid : ""
                }`}
              />
              <p
                id="uidnote"
                className={
                  phoneFocus && phone && !validPhone
                    ? classes.instructions
                    : classes.offscreen
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                must contain only numbers between 0-9.
                <br />
                Phone number must start with "05" numbers.
                <br />
                Phone number must have 10 numbers.
                <br />
              </p>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="country" className={classes.label}>
                Country:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={country ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    country || !country ? classes.hide : classes.invalid
                  }
                />
              </label>
              <select
                id="country"
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                required
                onFocus={() => setCountryFocus(true)}
                onBlur={() => setCountryFocus(false)}
                className={`${classes.input} ${
                  countryFocus && country ? classes.invalid : ""
                }`}
              >
                <option value="Israel">Israel</option>
                <option value="Germany">Germany</option>
                <option value="Hungary">Hungary</option>
                <option value="United States">United States</option>
              </select>
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="city" className={classes.label}>
                City:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={city ? classes.valid : classes.hide}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={city || !city ? classes.hide : classes.invalid}
                />
              </label>
              <input
                type="text"
                id="city"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                required
                onFocus={() => setCityFocus(true)}
                onBlur={() => setCityFocus(false)}
                className={`${classes.input} ${
                  cityFocus && city ? classes.invalid : ""
                }`}
              />
            </div>
            <button
            className={classes.submit} 
              disabled={
                !validName ||
                !validPwd ||
                !validMatch ||
                !validEmail ||
                !validFirstName ||
                !validPhone ||
                !validLastName
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className={classes.line}>
              <Link to={"/login"}>Sign In</Link>
            </span>
          </p>
        </section>
      )}
    </Fragment>
  );
};

export default Register;
