import React, {
  useEffect,
  useRef,
  useState,
  useContext
} from "react";

import "./message.css";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

import {
  ShopContext
} from "../../context/shopContext";

export default function Message() {

  const {
    token,
    backendUrl,
    navigate
  } = useContext(
    ShopContext
  );

  const socketRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [text, setText] =
    useState("");

  const adminId =
    "6a1b483b68ba7113ba383391";



  // USER CONNECTÉ
  const decoded =
    token
      ? jwtDecode(token)
      : null;

  const userId =
    decoded?.id;



  // PROTECTION
  useEffect(() => {

    if (!token) {
      navigate("/login");
    }

  }, [token]);



  // SOCKET CONNECT
  useEffect(() => {

    socketRef.current =
      io(backendUrl);

    socketRef.current.on(
      "connect",
      () => {

        console.log(
          "Socket connected:",
          socketRef.current.id
        );
      }
    );

    return () => {

      socketRef.current.disconnect();
    };

  }, []);




  // LOAD HISTORY
  useEffect(() => {

    const loadHistory =
      async () => {

        try {

          const roomId = [
            userId,
            adminId
          ]
            .sort()
            .join("_");

          socketRef.current.emit(
            "join_room",
            roomId
          );

          const res =
            await axios.get(
              `${backendUrl}/api/message/history/${userId}/${adminId}`
            );

          console.log(
            "History:",
            res.data
          );

          setMessages(
            res.data
              .messages
          );

        } catch (error) {

          console.log(error);
        }
      };

    if (userId) {
      loadHistory();
    }

  }, [userId]);




  // RECEIVE SOCKET
  useEffect(() => {

    if (
      !socketRef.current
    )
      return;

    socketRef.current.on(
      "receive_message",
      (message) => {

        console.log(
          "Message received:",
          message
        );

        setMessages(
          (prev) => [
            ...prev,
            message
          ]
        );
      }
    );

    return () => {

      socketRef.current.off(
        "receive_message"
      );
    };

  }, []);




  // AUTOSCROLL
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView(
      {
        behavior:
          "smooth"
      }
    );

  }, [messages]);




  // SEND MESSAGE
  const sendMessage =
    async () => {

      if (
        !text.trim()
      )
        return;

      const payload = {
        sender:
          userId,

        receiver:
          adminId,

        senderModel:
          "User",

        receiverModel:
          "Admin",

        text
      };

      try {

        await axios.post(
          `${backendUrl}/api/message/send`,
          payload
        );

        setText("");

      } catch (error) {

        console.log(error);
      }
    };



  return (
    <div className="message-container">

      <div className="message-header">

        <h2>
          Support Client
        </h2>

        <span>
          En ligne
        </span>

      </div>



      <div className="message-list">

        {messages.map(
          (
            msg,
            index
          ) => (

            <div
              key={index}
              className={`bubble ${
                msg.sender ===
                userId
                  ? "mine"
                  : "other"
              }`}
            >
              {msg.text}
            </div>
          )
        )}

        <div
          ref={
            messagesEndRef
          }
        />
      </div>



      <div className="message-input">

        <input
          type="text"
          placeholder="Écrire un message..."
          value={text}
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          onKeyDown={(e) =>
            e.key ===
              "Enter" &&
            sendMessage()
          }
        />

        <button
          onClick={
            sendMessage
          }
        >
          Envoyer
        </button>

      </div>
    </div>
  );
}

