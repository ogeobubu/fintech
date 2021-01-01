import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import moment from "moment";

import ProfileDetails from "./ProfileDetails";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
  Container,
  Grid,
} from "@material-ui/core";

import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  avatar: {
    height: 100,
    width: 100,
  },
}));

const Profile = ({ className, ...rest }) => {
  const auth = useSelector((state) => state.auth);

  const { user } = auth;

  const users = {
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <Card className={clsx(classes.root, className)} {...rest}>
            <CardContent>
              <Box alignItems="center" display="flex" flexDirection="column">
                <Avatar className={classes.avatar} />
                <Typography color="textPrimary" gutterBottom variant="h3">
                  {users.name}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {`${users.role} ${users.email}`}
                </Typography>
                <Typography
                  className={classes.dateText}
                  color="textSecondary"
                  variant="body1"
                >
                  {`${moment().format("hh:mm A")} WAT`}
                </Typography>
              </Box>
            </CardContent>
            <Divider />
          </Card>
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <ProfileDetails />
        </Grid>
      </Grid>
    </Container>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
};

export default Profile;
