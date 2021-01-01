import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import {
  Dashboard,
  DashboardOne,
  DashboardTwo,
  DashboardThree,
} from "./pages/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import ActivationEmail from "./components/auth/ActivationEmail";
import NotFound from "./components/utils/NotFound/NotFound";
import Profile from "./pages/Profile";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import EditUser from "./pages/EditUser";
import SignOut from "./pages/SignOut";

import { useDispatch, useSelector } from "react-redux";
import {
  dispatchLogin,
  fetchUser,
  dispatchGetUser,
} from "./redux/actions/authAction";

function App() {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);

  const auth = useSelector((state) => state.auth);

  const { isAdmin, isLogged } = auth;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post("/api/users/refresh_token", null);
        dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());

        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token, dispatch]);

  return (
    <>
      <Router>
        <Sidebar />
        <Switch>
          <Route
            path="/create"
            exact
            component={isLogged ? NotFound : Register}
          />
          <Route path="/login" exact component={isLogged ? NotFound : Login} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/dashboard/wallet" exact component={DashboardOne} />
          <Route path="/dashboard/bitcoin" exact component={DashboardTwo} />
          <Route path="/dashboard/giftcard" exact component={DashboardThree} />
          <Route path="/dashboard/profile" exact component={Profile} />
          <Route
            path="/user/activate/:activation_token"
            component={ActivationEmail}
            exact
          />
          <Route
            path="/forgot"
            exact
            component={isLogged ? NotFound : ForgotPassword}
          />
          <Route
            path="/user/reset/:token"
            exact
            component={isLogged ? NotFound : ResetPassword}
          />
          <Route
            path="/edit_user/:id"
            component={isAdmin ? EditUser : NotFound}
            exact
          />
          <Route path="/logout" exact component={SignOut} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
