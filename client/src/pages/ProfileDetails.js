import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { isLength, isMatch } from "../components/utils/validation/Validation";
import {
  fetchAllUsers,
  dispatchGetAllUsers,
} from "../redux/actions/usersAction";
import {
  showSuccessMsg,
  showErrMsg,
} from "../components/utils/notification/Navigation";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  err: "",
  success: "",
};

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: "flex-end",
  },
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();

  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const users = useSelector((state) => state.users);

  const { user, isAdmin } = auth;
  const [data, setData] = useState(initialState);
  const { name, password, cf_password, err, success } = data;

  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers(token).then((res) => {
        dispatch(dispatchGetAllUsers(res));
      });
    }
  }, [token, isAdmin, dispatch, callback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const updateInfo = () => {
    try {
      axios.patch(
        "/api/users/update",
        {
          name: name ? name : user.name,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Updated Successfully!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      axios.post(
        "/api/users/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Updated Successfully!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (name) updateInfo();
    if (password) updatePassword();
  };

  const handleDelete = async (id) => {
    try {
      if (user._id !== id) {
        if (window.confirm("Are you sure you want to delete this account?")) {
          setLoading(true);
          await axios.delete(`/api/users/delete/${id}`, {
            headers: { Authorization: token },
          });
          setLoading(false);
          setCallback(!callback);
        }
      }
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  return (
    <div>
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      {loading && <h3>Loading.....</h3>}

      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title={isAdmin ? "Admin Profile" : "Profile"}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Please specify the name"
                  name="name"
                  onChange={handleChange}
                  required
                  label={user.name}
                  value={name}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Reseller"
                  name="newPassword"
                  onChange={handleChange}
                  required
                  value={password}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  onChange={handleChange}
                  required
                  value={user.email}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={`0${user.number}`}
                  variant="outlined"
                  disabled
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  onChange={handleChange}
                  required
                  value={password}
                  variant="outlined"
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="cf_password"
                  onChange={handleChange}
                  required
                  value={cf_password}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button
              color="primary"
              onClick={handleUpdate}
              disabled={loading}
              variant="contained"
            >
              Save details
            </Button>
          </Box>
        </Card>
      </form>

      <Divider />
      <Grid item md={12} xs={12}>
        <Card className={clsx(classes.root, className)} {...rest}>
          <CardHeader title={isAdmin ? "Users" : "My Orders"} />
          <Divider />

          <Box minWidth={500}>
            <div style={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === "admin" ? (
                          <i className="fa fa-check" title="Admin"></i>
                        ) : (
                          <i className="fa fa-times" title="User"></i>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link to={`/edit_user/${user._id}`}>
                          <i className="fa fa-edit" title="Edit"></i>
                        </Link>
                        <i
                          className="fa fa-trash"
                          title="Remove"
                          onClick={() => handleDelete(user._id)}
                        ></i>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Box>
        </Card>
      </Grid>
    </div>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string,
};

export default ProfileDetails;
