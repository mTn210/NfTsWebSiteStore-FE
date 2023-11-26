import React, {
  useRef,
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import classes from "./Login.module.css";
import { authenticate } from "../../services/api";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LogoImg from "../../images/LogoImg.png";


function Login() {
  const navigate = useNavigate();
  const { setAuth, setIsLoggedIn } = useContext(AuthContext);

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userBody = { username: user, password: pwd };
      const response = await authenticate(userBody);
      const decoded = jwtDecode(response.data.jwt);
      setAuth({
        token: response.data.jwt,
        user: decoded,
      });
      setIsLoggedIn(true);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
      setUser("");
      setPwd("");
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 403) {
        setErrMsg("Incorrect Username Or Password");
      } else {
        setErrMsg("Authentication Failed");
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
          <h1>You Logged in!</h1>
        </section>
      ) : (
        <section>
          <p ref={errRef} className={errMsg ? classes.error_mes : "offscreen"}>
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button className={classes.submit}  type="submit" disabled={!user || !pwd} >
              Sign In
            </button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <Link to="/signUp">Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </Fragment>
  );
}

export default Login;
