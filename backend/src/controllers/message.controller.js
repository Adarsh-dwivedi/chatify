import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserList = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");
    return res.status(200).json({ users: otherUserList });
  } catch (error) {
    console.error("Message Get All User error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChatPartner = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    //get the list of message where one of the user is current user
    const currentUserMessage = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    });
    //get the list of unique user id where each id is not current user id
    const chatPartnerId = [
      ...new Set(
        currentUserMessage.map((user) =>
          user.senderId.equals(currentUserId) ? user.receiverId : user.senderId
        )
      ),
    ];
  
    const chatPartner = await User.find({
      _id: {
        $in: chatPartnerId,
      },
    }).select("-password");

    res.status(200).json({ user: chatPartner });
  } catch (error) {
    console.error("Error in Get Chat Partner: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessageByUserId = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const userToChatId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUserId },
      ],
    });
    res.status(200).json({ messages: messages });
  } catch (error) {
    console.error("Get Message By User Id Error: ", error);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const sendMessage = async (req, res) => {
    try{
        const currentUserId = req.user._id;
        const userToSendId = req.params.id;
        const {text, image} = req.body;

        //check if both text and image is missing
        if(!text && !image){
            return res.status(400).json({message: "Text or Image is needed"});
        }
        //check if sender and receiver is same
        else if(currentUserId===userToSendId){
            return res.status(400).json({message: "Can not send message to yourself"});
        }
        //check if receiver exist
        const userToSendExist = await User.exists({_id: userToSendId});
        if(!userToSendExist){
            return res.status(400).json({message: "Receiver not found"});
        }

        let imageUrl;
        if(image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }
        

        const message = new Message({
            senderId: currentUserId,
            receiverId: userToSendId,
            text,
            image: imageUrl
        });

        await message.save();
        res.status(201).json({message: "Message Send successfully"});
    }catch(error){
        console.error("Send Message Error: ", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};
