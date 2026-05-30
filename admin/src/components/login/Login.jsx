
import React, {
  useState
} from 'react';

import './login.css';
import axios from 'axios';

import {
  backendUrl
} from '../../App';

import {
  toast
} from 'react-toastify';

export default function Login({
  setToken
}) {

  const [email, setEmail] =
    useState('');

  const [
    password,
    setPassword
  ] = useState('');



  const onSubmitHandler =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await axios.post(
            backendUrl +
              '/api/admin/login',
            {
              email,
              password
            }
          );

        console.log(
          "LOGIN RESPONSE :",
          response.data
        );

        if (
          response.data.success
        ) {

          // token
          setToken(
            response.data.token
          );

          // save admin
          localStorage.setItem(
            "admin",
            JSON.stringify(
              response.data.admin
            )
          );

          console.log(
            "ADMIN SAVED :",
            response.data.admin
          );

          toast.success(
            "Connexion réussie"
          );

        } else {

          toast.error(
            response.data.message
          );
        }

      } catch (error) {

        console.log(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Erreur serveur"
        );
      }
    };



  return (
    <div className="container">

      <div className="card">

        <h1 className="title">
          Admin Panel
        </h1>

        <form
          onSubmit={
            onSubmitHandler
          }
        >

          <div className="input-group">

            <p className="label">
              Email Address
            </p>

            <input
              className="input"
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

          </div>

          <div className="input-group">

            <p className="label">
              Password
            </p>

            <input
              className="input"
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>

          <button className="button">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}
