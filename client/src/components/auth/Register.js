import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import axios from "axios";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../components/utils/notification/Navigation";
import {
  isEmpty,
  isEmail,
  isLength,
  isMatch,
} from "../../components/utils/validation/Validation";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));

const initialState = {
  name: "",
  email: "",
  number: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const Register = () => {
  const [user, setUser] = useState(initialState);

  const { name, email, number, password, cf_password, err, success } = user;

  const classes = useStyles();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEmpty(name) || isEmpty(password))
      return setUser({
        ...user,
        err: "Please fill in all fields.",
        success: "",
      });

    if (!isEmail(email))
      return setUser({ ...user, err: "Invalid email.", success: "" });

    if (isLength(password))
      return setUser({
        ...user,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setUser({ ...user, err: "Password did not match.", success: "" });

    try {
      const res = await axios.post("/api/users/create", {
        name,
        email,
        number,
        password,
      });

      setUser({ ...user, err: "", success: res.data.msg });
    } catch (err) {
      err.response.data.msg &&
        setUser({ ...user, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <Container className={classes.container} maxWidth="xs">
      <h2>Register</h2>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  id="name"
                  name="name"
                  size="small"
                  variant="outlined"
                  value={name}
                  name="name"
                  onChange={handleChangeInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  size="small"
                  variant="outlined"
                  value={number}
                  name="number"
                  onChange={handleChangeInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  size="small"
                  variant="outlined"
                  value={email}
                  name="email"
                  onChange={handleChangeInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Referral"
                  name="referral"
                  size="small"
                  variant="outlined"
                  defaultValue="OhTopUp"
                  disabled
                  //   onChange={(e) => setReferral(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  size="small"
                  type="password"
                  variant="outlined"
                  value={password}
                  name="password"
                  onChange={handleChangeInput}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  size="small"
                  type="password"
                  variant="outlined"
                  value={cf_password}
                  name="cf_password"
                  onChange={handleChangeInput}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              fullWidth
              type="submit"
              variant="contained"
            >
              Create Account
            </Button>
          </Grid>
        </Grid>
      </form>

      <p>
        Already an account? <Link to="/login">Login</Link>
      </p>
    </Container>
  );
};

export default Register;
