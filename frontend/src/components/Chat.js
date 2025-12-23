import React, { useEffect, useState, useRef } from "react";
import { Box, VStack, Input, Button, Text, Flex } from "@chakra-ui/react";
import { io } from "socket.io-client";

let socket;

const Chat = ({ match }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const roomName = match.params.groupName;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect socket and join room if not already connected
    if (!socket) {
      const SOCKET_URL = process.env.REACT_APP_API_URL;
      socket = io(SOCKET_URL);

    }

    const username = new URLSearchParams(window.location.search).get("username");

    socket.emit("joinRoom", { roomName, username });

    // Listen for incoming messages
    const handleMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    socket.on("message", handleMessage);

    // Cleanup when component unmounts
    return () => {
      if (socket) {
        socket.emit("leaveRoom", { roomName }); // Notify server when user leaves
        socket.off("message", handleMessage); // Remove event listener to prevent memory leaks
      }
    };
  }, [roomName]);

  useEffect(() => {
    // Scroll to the bottom of the messages container whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { roomName, message: message.trim() });
      setMessage(""); // Clear the input after sending the message
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      backgroundImage="url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eXWZ3rAjpb43fiGhevnJIFGoNfQoUYemQw&s')"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <VStack spacing={6} width={{ base: "90%", md: "50%" }} p={6} borderWidth="1px" borderRadius="lg" boxShadow="2xl" background="rgba(255, 255, 255, 0.85)">
        <Text fontSize="2xl" fontWeight="bold" color="teal.600">
          Welcome to the {roomName} Chat!
        </Text>
        <Box
          width="100%"
          height="400px"
          overflowY="scroll"
          borderWidth="1px"
          borderRadius="md"
          padding={4}
          background="pink"
          boxShadow="md"
        >
          {messages.map((msg, index) => (
            <Flex
              key={index}
              justifyContent="center" // Align message container to the center
              mb={2}
            >
              <Box
                width="100%" // Full width for consistent box sizing
                maxWidth="80%" // Optional: limit maximum width for better appearance
                bg={msg.username === "You" ? "blue.500" : "green.300"}
                color="white"
                p={3}
                borderRadius="10px"
                boxShadow="lg"
                textAlign="center" // Center the text inside the box
              >
                {msg.username !== "You" && (
                  <Text fontWeight="bold" color="blackAlpha.800" mb={1} textAlign="center">
                    {msg.username}
                  </Text>
                )}
                <Text>{msg.text}</Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          borderColor="teal.400"
          focusBorderColor="teal.500"
          boxShadow="sm"
        />
        <Button colorScheme="teal" onClick={sendMessage} width="100%" boxShadow="lg">
          Send
        </Button>
      </VStack>
    </Box>
  );
};

export default Chat;
