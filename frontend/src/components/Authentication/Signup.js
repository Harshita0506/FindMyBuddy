import { Button, Box, Heading, VStack } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import backgroundImage from "./background.png";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const toast = useToast();
  const history = useHistory();

  const API = process.env.REACT_APP_API_URL; // ✅ IMPORTANT

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
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

      // ✅ CORRECT API CALL (NO RELATIVE URL)
      const { data } = await axios.post(
        `${API}/api/user`,
        {
          name,
          email,
          password,
        },
        config
      );

      toast({
        title: "Registration Successful",
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
          error.response?.data?.message || "Something went wrong",
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
        spacing={4}
        padding={8}
        boxShadow="lg"
        borderWidth="1px"
        borderRadius="md"
        background="white"
      >
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Sign Up
        </Heading>

        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
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
          Sign Up
        </Button>

        <Button
          variant="outline"
          colorScheme="teal"
          width="100%"
          mt={2}
          onClick={() => history.push("/login")}
        >
          Go to Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Signup;
