import React, { useState } from "react";
import backgroundImage from "./background.png";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const history = useHistory();

  const API = process.env.REACT_APP_API_URL; // ✅ IMPORTANT

  const handleClick = () => setShowPassword(!showPassword);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email Format",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // ✅ CORRECT API CALL (NO PROXY, NO RELATIVE URL)
      const { data } = await axios.post(
        `${API}/api/user/login`,
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      history.push("/domain");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description:
          error.response?.data?.message ||
          "Invalid credentials, please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      backgroundImage={`url(${backgroundImage})`}
      backgroundSize="cover"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        spacing="5px"
        padding={8}
        boxShadow="lg"
        borderWidth="1px"
        borderRadius="md"
        background="white"
      >
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Login
        </Heading>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          mt={4}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>

        <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          mt={4}
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>

        <Button
          variant="outline"
          colorScheme="teal"
          width="100%"
          mt={2}
          onClick={() => history.push("/")}
        >
          Go to Sign Up
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
