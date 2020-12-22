import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";

import {
  Avatar,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  Box,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  profileWrapper: {
    display: "flex",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    maxWidth: "700px",
    margin: "0 auto",
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginRight: 20,
    marginBottom: 20,
    marginInline: "auto",
  },
  profileTextBox: {
    marginBottom: theme.spacing(4),
    textAlign: "center",
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
  },
  buttonBox: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
}));

function ProfileBox({ userData, myProfile }) {
  const classes = useStyles();
  const history = useHistory();
  const profileBool = myProfile;

  return (
    <Grid container className={classes.profileWrapper}>
      <Grid item xs={12} sm={4}>
        <Avatar className={classes.avatar} src={userData.profileImage} />
      </Grid>
      <Grid item xs={12} sm={8}>
        {userData.name !== "" && (
          <Box className={classes.profileTextBox} mx="auto">
            <Typography variant="h4">{userData.name}</Typography>
            <Typography variant="subtitle2">{userData.bio} </Typography>
          </Box>
        )}
        {userData.name === "" && userData.bio === "" && (
          <Box className={classes.profileTextBox}>
            <Typography variant="body1">
              You don't have any information about your self.
            </Typography>
            <Button
              style={{ margin: "16px" }}
              variant="contained"
              color="primary"
              onClick={() => history.push("/editProfile")}
            >
              Get started
            </Button>
          </Box>
        )}
      </Grid>
      {userData.name !== "" && profileBool === true && (
        <Grid item xs={12} className={classes.buttonBox}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => history.push("/upload")}
          >
            Upload Image
          </Button>
          <IconButton onClick={() => history.push("/editProfile")}>
            <SettingsIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}
export default ProfileBox;
