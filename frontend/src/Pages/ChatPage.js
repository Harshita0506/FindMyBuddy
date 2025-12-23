import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatPage = () => {
  const [chats, setChats] = useState([]);  // State to store fetched chats

  const fetchChats = async () => {
    const { data } = await axios.get("/api/chat");
    setChats(data);  // Update state with fetched chats
    console.log(data);  // Log the fetched data to verify
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (  // Render each chat item
        <div key={chat._id}>{chat.chatName}</div>  // Using chat._id as key and displaying chatName
      ))}
    </div>
  );
};

export default ChatPage;
