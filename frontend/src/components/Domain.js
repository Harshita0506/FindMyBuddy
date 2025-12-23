import React, { useEffect, useState } from "react";
import { Box, VStack, Heading, Button, Image, Input, FormControl } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import backgroundImage from "./Authentication/background.png";  

const SOCKET_URL = process.env.REACT_APP_API_URL;

const socket = io(SOCKET_URL);

const Domain = () => {
  const history = useHistory();
  const [locationStatus, setLocationStatus] = useState("Your location is not shared");
  const [locationDetails, setLocationDetails] = useState(null);
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState(""); // State to hold the username input

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    return () => {
      socket.off("connect"); // Clean up the event listener on component unmount
    };
  }, []);

  const handleJoinGroup = (groupName) => {
    if (!username) {
      alert("Please enter your name before joining a group.");
      return;
    }
    socket.emit("joinRoom", { roomName: groupName, username: username });
    history.push(`/chat/${groupName}?username=${username}`); // Pass username as a query parameter
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationStatus("Location shared");
          setLocationDetails(`Latitude: ${latitude}, Longitude: ${longitude}`);
          
          // Reverse Geocoding to get address
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress("Unable to retrieve address");
            }
          } catch (error) {
            console.error("Error fetching address:", error);
            setAddress("Error retrieving address");
          }
        },
        (error) => {
          setLocationStatus("Unable to retrieve your location");
          console.error("Error getting location: ", error);
        }
      );
    } else {
      setLocationStatus("Geolocation is not supported by this browser");
    }
  };

  const handleJoinNearbyChat = () => {
    handleJoinGroup("WebDevelopment"); // This should be updated to dynamically choose a nearby group
  };

  return (
    <Box
      backgroundImage={`url(${backgroundImage})`}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      padding={2}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <VStack spacing={4} width="90%" height="95%">
        <Box 
          background="blue.100"
          padding={4}
          borderRadius="md"
          border="1px solid"
          borderColor="blue.900"
          width="100%"
          textAlign="center"
        >
          <Heading as="h2" size="2xl" color="blue.900">
            Select a Group to Join
          </Heading>
        </Box>

        {/* Username Input Section */}
        <Box display="flex" justifyContent="center" width="100%">
          <FormControl id="username" isRequired width="40%">
            <Input
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              marginBottom={2}
              background="blue.200"
              textAlign="center"
            />
          </FormControl>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          gap={4}
          width="100%"
          height="40%"
        >
          <Box
            width={{ base: "100%", md: "30%" }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            background="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}  // Slight scale effect on hover
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiEjBilP-PBEbL7NAsVh5jU2PEYPgaGhh8-g&s"
              alt="Web Development Group"
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Box p={3} textAlign="center">
              <Button
                colorScheme="blue"
                width="100%"
                onClick={() => handleJoinGroup("WebDevelopment")}
              >
                Join Web Development Group
              </Button>
            </Box>
          </Box>

          <Box
            width={{ base: "100%", md: "30%" }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            background="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}  // Slight scale effect on hover
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6eXWZ3rAjpb43fiGhevnJIFGoNfQoUYemQw&s"
              alt="AI/ML Group"
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Box p={3} textAlign="center">
              <Button
                colorScheme="teal"
                width="100%"
                onClick={() => handleJoinGroup("AI_ML")}
              >
                Join AI/ML Group
              </Button>
            </Box>
          </Box>

          <Box
            width={{ base: "100%", md: "30%" }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="lg"
            background="white"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}  // Slight scale effect on hover
          >
            <Image
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC65H_AzkklnHH0OlQdq7kYkRsR0v1Jhvjng&s"
              alt="DSA Group"
              objectFit="cover"
              width="100%"
              height="150px"
            />
            <Box p={3} textAlign="center">
              <Button
                colorScheme="purple"
                width="100%"
                onClick={() => handleJoinGroup("DSA")}
              >
                Join DSA Group
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          padding={3}
          background="blue.200"
          borderRadius="lg"
          boxShadow="lg"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Box
            flex="1"
            padding={2}
            textAlign="center"
          >
            <Heading as="h4" size="md" color="blue.900">
              Share Your Location
            </Heading>
            <Button
              colorScheme="green"
              marginTop={2}
              onClick={handleShareLocation}
            >
              Share Location
            </Button>
          </Box>
          <Box
            flex="1"
            padding={2}
            textAlign="center"
          >
            <Heading as="h4" size="md" color="blue.900">
              {locationStatus}
            </Heading>
            {locationDetails && (
              <Heading as="h5" size="sm" color="blue.700" marginTop={1}>
                {locationDetails}
              </Heading>
            )}
            {address && (
              <Heading as="h5" size="sm" color="blue.500" marginTop={1}>
                {address}
              </Heading>
            )}
            {locationStatus === "Location shared" && (
              <Button
                colorScheme="blue"
                marginTop={4}
                onClick={handleJoinNearbyChat}
              >
                Join Nearby Group Chat
              </Button>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Domain;
