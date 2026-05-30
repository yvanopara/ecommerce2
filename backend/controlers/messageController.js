import userModel from "../models/userModel.js";
import Message from "../models/messageModel.js";
import { io } from "../server.js";

import axios from "axios";

// ENVOYER MESSAGE + SOCKET.IO
export const sendMessage = async (
  req,
  res
) => {
  try {

    const {
      sender,
      receiver,
      senderModel,
      receiverModel,
      text
    } = req.body;

    const message =
      await Message.create({
        sender,
        receiver,
        senderModel,
        receiverModel,
        text
      });

    // room privée user-admin
    const roomId = [
      sender,
      receiver
    ]
      .sort()
      .join("_");

    // temps réel
    io.to(roomId).emit(
      "receive_message",
      message
    );
  
// notifier telegram
try {

  await axios.post(
    "http://localhost:5000/notify",
    {
      message:
        `💬 Nouveau message client:\n\n${text}`
    }
  );

  console.log(
    "Telegram notification envoyée"
  );

} catch (error) {

  console.log(
    "Erreur telegram:",
    error.message
  );
}


    res.status(201).json({
      success: true,
      message
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Impossible d'envoyer le message",
      error
    });
  }
};


// HISTORIQUE USER ↔ ADMIN
export const getMessages = async (
  req,
  res
) => {
  try {

    const {
      userId,
      adminId
    } = req.params;

    const messages =
      await Message.find({
        $or: [
          {
            sender:
              userId,
            receiver:
              adminId
          },
          {
            sender:
              adminId,
            receiver:
              userId
          }
        ]
      }).sort({
        createdAt: 1
      });

    res.status(200).json({
      success: true,
      messages
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Impossible de récupérer les messages",
      error
    });
  }
};


// MARQUER MESSAGE COMME LU
export const markAsRead = async (
  req,
  res
) => {
  try {

    const {
      messageId
    } = req.params;

    const message =
      await Message.findByIdAndUpdate(
        messageId,
        {
          isRead: true
        },
        {
          new: true
        }
      );

    res.status(200).json({
      success: true,
      message
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Impossible de marquer le message comme lu",
      error
    });
  }
};


// LISTE DES CONVERSATIONS D'UN ADMIN
export const getConversations =
  async (req, res) => {
    try {

      const {
        adminId
      } = req.params;

      // récupérer tous les messages liés à l'admin
      const messages =
        await Message.find({
          $or: [
            {
              sender:
                adminId,
              senderModel:
                "Admin"
            },
            {
              receiver:
                adminId,
              receiverModel:
                "Admin"
            }
          ]
        }).sort({
          createdAt: -1
        });

      const usersMap =
        new Map();

      for (
        const msg of messages
      ) {

        let userId =
          null;

        // admin -> user
        if (
          msg.senderModel ===
          "Admin"
        ) {
          userId =
            msg.receiver;
        }

        // user -> admin
        else {
          userId =
            msg.sender;
        }

        // éviter doublons
        if (
          !usersMap.has(
            userId.toString()
          )
        ) {

          const user =
            await userModel.findById(
              userId
            );

          usersMap.set(
            userId.toString(),
            {
              userId,

              name:
                user?.name ||
                "Utilisateur",

              email:
                user?.email ||
                "",

              lastMessage:
                msg.text,

              createdAt:
                msg.createdAt
            }
          );
        }
      }

      res.json({
        success: true,
        conversations:
          Array.from(
            usersMap.values()
          )
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Impossible de récupérer les conversations"
      });
    }
  };
