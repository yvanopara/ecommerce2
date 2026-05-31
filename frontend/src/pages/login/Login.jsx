
import React, {
  useContext,
  useEffect,
  useState
} from "react";

import "./login.css";

import {
  ShopContext
} from "../../context/shopContext";

import axios from "axios";

import {
  toast
} from "react-toastify";

import {
  GoogleLogin
} from "@react-oauth/google";

export default function Login() {

  const [
    currentState,
    setCurrentState
  ] = useState(
    "Connection"
  );

  const {
    token,
    setToken,
    navigate,
    backendUrl
  } = useContext(
    ShopContext
  );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [phone, setPhone] =
    useState("");

  const [
    profileImage,
    setProfileImage
  ] = useState(null);



  // LOGIN / REGISTER
  const onSubmitHandler =
    async (event) => {

      event.preventDefault();

      try {

        // REGISTER
        if (
          currentState
            .toLowerCase()
            .includes(
              "cree"
            )
        ) {

          const formData =
            new FormData();

          formData.append(
            "name",
            name
          );

          formData.append(
            "email",
            email
          );

          formData.append(
            "password",
            password
          );

          formData.append(
            "phone",
            phone
          );

          if (
            profileImage
          ) {
            formData.append(
              "profileImage",
              profileImage
            );
          }

          const response =
            await axios.post(
              `${backendUrl}/api/user/register`,
              formData
            );

          if (
            response.data
              .success
          ) {

            setToken(
              response.data
                .token
            );

            localStorage.setItem(
              "token",
              response.data
                .token
            );

            toast.success(
              "Compte créé avec succès"
            );

          } else {

            toast.error(
              response.data
                .message
            );
          }

        }

        // LOGIN
        else {

          const response =
            await axios.post(
              `${backendUrl}/api/user/login`,
              {
                email,
                password
              }
            );

          if (
            response.data
              .success
          ) {

            setToken(
              response.data
                .token
            );

            localStorage.setItem(
              "token",
              response.data
                .token
            );

            toast.success(
              "Connexion réussie"
            );

          } else {

            toast.error(
              response.data
                .message
            );
          }
        }

      } catch (error) {

        toast.error(
          error.response
            ?.data
            ?.message ||
            error.message
        );
      }
    };



  // GOOGLE LOGIN
  const handleGoogle =
    async (
      credentialResponse
    ) => {

      try {

        const response =
          await axios.post(
            `${backendUrl}/api/user/google`,
            {
              credential:
                credentialResponse.credential
            }
          );

        if (
          response.data
            .success
        ) {

          setToken(
            response.data
              .token
          );

          localStorage.setItem(
            "token",
            response.data
              .token
          );

          toast.success(
            "Connexion Google réussie"
          );

        }

      } catch (error) {

        console.log(
          error
        );

        toast.error(
          "Erreur Google"
        );
      }
    };



  useEffect(() => {

    if (token) {
      navigate("/");
    }

  }, [token]);



  return (
    <form
      onSubmit={
        onSubmitHandler
      }
      className="login-form"
    >

      <div className="login-title">

        <p className="login-heading">
          {currentState}
        </p>

      </div>


      {/* IMAGE */}
      {currentState !==
        "Connection" && (

        <>

          <input
            type="file"
            accept="image/*"
            onChange={(
              e
            ) =>
              setProfileImage(
                e.target
                  .files[0]
              )
            }
          />

          <input
            type="text"
            className="login-input"
            placeholder="Nom"
            value={name}
            onChange={(
              e
            ) =>
              setName(
                e.target
                  .value
              )
            }
            required
          />

          <input
            type="text"
            className="login-input"
            placeholder="Téléphone (optionnel)"
            value={phone}
            onChange={(
              e
            ) =>
              setPhone(
                e.target
                  .value
              )
            }
          />

        </>
      )}


      <input
        type="email"
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
        required
      />

      <input
        type="password"
        className="login-input"
        placeholder="Password"
        value={password}
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        required
      />



      <div className="login-footer">

        {currentState ===
        "Connection" ? (

          <p
            className="login-link"
            onClick={() =>
              setCurrentState(
                "Creez un compte"
              )
            }
          >
            Creez un compte
          </p>

        ) : (

          <p
            className="login-link"
            onClick={() =>
              setCurrentState(
                "Connection"
              )
            }
          >
            Connectez-vous ici
          </p>

        )}

      </div>



      <button className="login-button">

        {currentState ===
        "Connection"
          ? "Connexion"
          : "Créer un compte"}

      </button>



      <div
        style={{
          marginTop:
            "20px"
        }}
      >
        <GoogleLogin
          onSuccess={
            handleGoogle
          }
          onError={() =>
            toast.error(
              "Erreur Google"
            )
          }
        />
      </div>

    </form>
  );
}

