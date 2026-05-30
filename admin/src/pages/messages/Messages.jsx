
import React, {
  useEffect,
  useRef,
  useState
} from "react";

import "./messages.css";
import axios from "axios";
import { io } from "socket.io-client";

import {
  backendUrl
} from "../../App";

export default function Message() {

  const socketRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const [
    conversations,
    setConversations
  ] = useState([]);

  const [
    selectedUser,
    setSelectedUser
  ] = useState(null);

  const [
    messages,
    setMessages
  ] = useState([]);

  const [text, setText] =
    useState("");



  // ADMIN CONNECTÉ
  const admin =
    JSON.parse(
      localStorage.getItem(
        "admin"
      )
    );

  const adminId =
    admin?._id;



  // SOCKET CONNECTION
  useEffect(() => {

    socketRef.current =
      io(backendUrl);

    socketRef.current.on(
      "connect",
      () => {

        console.log(
          "SOCKET CONNECTED :",
          socketRef.current.id
        );
      }
    );

    return () => {

      socketRef.current.disconnect();
    };
  }, []);




  // LOAD CONVERSATIONS
  useEffect(() => {

    const getConversations =
      async () => {

        try {

          const res =
            await axios.get(
              `${backendUrl}/api/message/conversations/${adminId}`
            );

          setConversations(
            res.data
              .conversations
          );

        } catch (error) {

          console.log(
            "Conversation error :",
            error
          );
        }
      };

    if (adminId) {
      getConversations();
    }

  }, [adminId]);




  // LOAD HISTORY
  const loadHistory =
    async (user) => {

      setSelectedUser(
        user
      );

      try {

        const roomId = [
          adminId,
          user.userId
        ]
          .sort()
          .join("_");

        socketRef.current.emit(
          "join_room",
          roomId
        );

        const res =
          await axios.get(
            `${backendUrl}/api/message/history/${user.userId}/${adminId}`
          );

        setMessages(
          res.data
            .messages
        );

      } catch (error) {

        console.log(
          "History error :",
          error
        );
      }
    };




  // RECEIVE SOCKET MESSAGE
  useEffect(() => {

    if (
      !socketRef.current
    )
      return;

    socketRef.current.on(
      "receive_message",
      (message) => {

        console.log(
          "SOCKET MESSAGE RECEIVED :",
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
        !text.trim() ||
        !selectedUser
      ) {
        return;
      }

      const payload = {
        sender:
          adminId,

        receiver:
          selectedUser.userId,

        senderModel:
          "Admin",

        receiverModel:
          "User",

        text
      };

      try {

        await axios.post(
          `${backendUrl}/api/message/send`,
          payload
        );

        console.log(
          "Message saved DB + socket emitted from backend"
        );

        setText("");

      } catch (error) {

        console.log(
          "Send error :",
          error
        );
      }
    };



  return (
    <div className="message-page">

      {/* LEFT */}
      <div className="conversation-sidebar">

        <h2>
          Conversations
        </h2>

        {conversations.map(
          (user) => (

            <div
              key={
                user.userId
              }
              className={`conversation-item ${
                selectedUser
                  ?.userId ===
                user.userId
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                loadHistory(
                  user
                )
              }
            >

              <div className="avatar">
                {
                  user.name?.[0]
                }
              </div>

              <div className="conversation-info">

                <h4>
                  {user.name}
                </h4>

                <p>
                  {
                    user.lastMessage
                  }
                </p>

              </div>

            </div>
          )
        )}

      </div>



      {/* RIGHT */}
      <div className="chat-area">

        {selectedUser ? (
          <>

            <div className="chat-header">

              <h3>
                {
                  selectedUser.name
                }
              </h3>

              <span>
                {
                  selectedUser.email
                }
              </span>

            </div>


            <div className="chat-messages">

              {messages.map(
                (
                  msg,
                  index
                ) => (

                  <div
                    key={
                      index
                    }
                    className={`message-bubble ${
                      msg.sender ===
                      adminId
                        ? "sent"
                        : "received"
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


            <div className="chat-input">

              <input
                type="text"
                placeholder="Écrire un message..."
                value={text}
                onChange={(
                  e
                ) =>
                  setText(
                    e.target
                      .value
                  )
                }
                onKeyDown={(
                  e
                ) =>
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
                Send
              </button>

            </div>

          </>
        ) : (

          <div className="empty-chat">
            Sélectionnez une conversation
          </div>
        )}

      </div>
    </div>
  );
}

