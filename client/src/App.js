import React, { useContext, createContext, useEffect, useReducer } from "react";
import NavBar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, useHistory, Switch } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Login from "./components/screens/Login";

import SubscribedUser from "./components/screens/SubscribedUser";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile"
import { initialState, reducer } from "./reducers/userReducer";
export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
if (user) {
      dispatch({ type: "USER", payload: user });
      //history.push("/");
    } else {
      history.push("/login");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/profile/:userid">
        <UserProfile/>
      </Route>
      <Route exact path="/myfollowerpost">
        <SubscribedUser/>
      </Route>
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    // we have all the componets access of state and dispatch
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
