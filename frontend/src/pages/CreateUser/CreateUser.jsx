import { useContext, useEffect, useRef, useState } from "react";
import "./CreateUser.scss";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

function CreateUser() {
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const passwordRef = useRef();

  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  // all for email
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  // all for password
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // REGEX control email format
  const validateEmail = (mail) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(mail);
  };

  // REGEX control password format
  const validatePassword = (pass) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{12,}$/;
    return passwordRegex.test(pass);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Check e-mail format when it changes
    setIsValidEmail(validateEmail(newEmail));
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    // Check password format when it changes
    setIsValidPassword(validatePassword(newPassword));
  };

  // This page is only accessible to admins
  // Redirect unconnected users
  useEffect(() => {
    if (!user[0].user_id) {
      navigate("/");
    } else if (!user[0].admin_id) {
      navigate("/homepage/decisions/all");
    }
  }, []);
  // Form Submission Manager
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValidEmail) {
      alert(
        "⚠ Erreur: Format d'email invalide, l'utilisateur n'a pas été créé. ⚠"
      );
    } else if (!isValidPassword) {
      alert(
        "⚠ Erreur: Le mot de passe doit comporter 12 caractères dont 1 majuscule, 1 chiffre et 1 caractère spécial. ⚠"
      );
    } else {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/create`,
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstname: firstnameRef.current.value,
              lastname: lastnameRef.current.value,
              email: emailRef.current.value,
              location: locationRef.current.value,
              password: passwordRef.current.value,
              admin: isAdmin,
            }),
          }
        );

        if (response.status === 201) {
          setMessage(
            `🚀 Utilisateur créé : ${lastnameRef.current.value} ${firstnameRef.current.value}. 🚀`
          );
          firstnameRef.current.value = "";
          lastnameRef.current.value = "";
          emailRef.current.value = "";
          locationRef.current.value = "Americas";
          passwordRef.current.value = "";
        } else {
          console.info(response);
        }
      } catch (err) {
        console.error("Error in user creation", err);
      }
    }
  };
  return (
    <main className="createuser__content">
      <h1 className="createuser__title">Nouvel utilisateur</h1>
      <form className="createuser__form" onSubmit={handleSubmit}>
        <div className="createuser__form--inputsBox">
          <p className="createuser__form--mandatoryFields">
            Tous les champs sont obligatoires.
          </p>
          <label htmlFor="lastname" className="createuser__label">
            <strong>Nom</strong>
            <input
              id="lastname"
              className="createuser__input"
              type="text"
              name="lastname"
              ref={lastnameRef}
              required
            />
          </label>
          <label htmlFor="firstname" className="createuser__label">
            <strong>Prénom</strong>
            <input
              id="firstname"
              className="createuser__input"
              type="text"
              name="firstname"
              ref={firstnameRef}
              required
            />
          </label>
          <label htmlFor="email" className="createuser__label">
            <strong>Email</strong>
            <input
              id="email"
              value={email}
              className="createuser__input"
              type="email"
              name="email"
              ref={emailRef}
              onChange={handleEmailChange}
              required
            />
          </label>
          {email && !isValidEmail && (
            <p style={{ color: "red", backgroundColor: "transparent" }}>
              Format d'email invalide
            </p>
          )}
          <label htmlFor="workplace" className="createuser__label">
            <strong>Bureau</strong>
            <select
              name="workplace"
              className="createuser__input"
              id="workplace"
              ref={locationRef}
              required
            >
              <option value="Americas">Americas</option>
              <option value="France">France</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Philippines">Philippines</option>
              <option value="West Africa">West Africa</option>
            </select>
          </label>
          <label htmlFor="password" className="createuser__label">
            <strong>Mot de passe</strong>
            <input
              id="password"
              className="createuser__input"
              value={password}
              type="password"
              name="motDePasse"
              ref={passwordRef}
              onChange={handlePasswordChange}
              required
            />
            <small />
          </label>
          {!isValidPassword && password !== "" && (
            <p style={{ color: "red", backgroundColor: "transparent" }}>
              Au moins 12 caractères, 1 majuscule, 1 chiffre et 1 caractère
              spécial.
            </p>
          )}
          <label htmlFor="admin" className="createuser__label">
            <strong>Cet utilisateur est-il un administrateur ?</strong>
            <span className="createuser__input--radios">
              <label htmlFor="adminNo" className="createuser__input--radioNo">
                <input
                  id="adminNo"
                  type="radio"
                  name="admin"
                  value="notAdmin"
                  onChange={() => setIsAdmin(false)}
                  checked={!isAdmin}
                />
                Non
              </label>
              <label htmlFor="adminYes" className="createuser__input--radioYes">
                <input
                  id="adminYes"
                  type="radio"
                  name="admin"
                  value="isAdmin"
                  onChange={() => setIsAdmin(true)}
                  checked={isAdmin}
                />
                Oui
              </label>
            </span>
          </label>
        </div>
        <button className="createuser__button" type="submit">
          Créer
        </button>
      </form>
      <p className="createuser__message">{message}</p>
    </main>
  );
}

export default CreateUser;
