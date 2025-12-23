import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import Domain from "./components/Domain";
import Chat from "./components/Chat"; // Import Chat component

function App() {
  return (
    <Box
       
    >
      <Router>
        <Switch>
          <Route path="/" exact component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/domain" component={Domain} />
          <Route path="/chat/:groupName" component={Chat} /> {/* Dynamic route for group chat */}
        </Switch>
      </Router>
    </Box>
  );
}

export default App;
