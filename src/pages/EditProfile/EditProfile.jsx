import React, { useEffect, useState, useContext } from "react";
import { Section } from "../../components";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import "firebase/storage";
import "./EditProfile.scss";
import {
  Button,
  Container,
  Avatar,
  Typography,
  Grid,
  makeStyles,
  Input,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  profileWrapper: {
    display: "flex",
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginRight: 20,
  },
}));

function EditProfile() {
  const Auth = useContext(AuthContext);
  const history = useHistory();
  const [image, setImage] = useState();
  const [progress, setProgress] = useState();
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(Auth.state)
      .get()
      .then((data) => {
        if (data.data()) {
          setUserData({
            name: data.data().name,
            bio: data.data().bio,
            profileImage: data.data().profileImage,
          });
        }
      });
  }, [Auth.state]);

  function submitChanges(e) {
    e.preventDefault();
    setFormLoading(true);
    console.log("submitChange function started");

    if (image) {
      console.log("if image started");
      const uploadTask = firebase
        .storage()
        .ref(`images/${image.name}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // error function
          console.log(error);
        },
        () => {
          // complete function
          firebase
            .storage()
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              // storage/users
              firebase
                .firestore()
                .collection("users")
                .doc(Auth.state)
                .set({
                  bio: userData.bio,
                  name: userData.name,
                  profileImage: url,
                })
                .then(() => {
                  // firebase Auth update
                  firebase
                    .auth()
                    .currentUser.updateProfile({
                      displayName: userData.name,
                      photoURL: url,
                    })
                    .then(() => {
                      console.log("Auth updated");
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .then(() => {
                  history.push("/myProfile");
                })
                .catch((error) => {
                  setFormLoading(false);
                  console.log(error);
                });
            });
        }
      );
    } else {
      updateAuthProfile();
      saveUserData();
    }
  }

  function updateAuthProfile() {
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: userData.name,
        photoURL: userData.profileImage,
      })
      .then(() => {
        console.log("Auth updated");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function saveUserData() {
    firebase
      .firestore()
      .collection("users")
      .doc(Auth.state)
      .set({
        bio: userData.bio,
        name: userData.name,
        profileImage: userData.profileImage,
      })
      .then(() => history.push("/myProfile"))
      .catch(() => {
        setFormLoading(false);
      });
  }

  return (
    <Section>
      <Container>
        <Typography variant="h2">Edit Profile</Typography>
        {progress && <progress value={progress} />}
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Avatar className={classes.avatar} src={userData.profileImage} />
              <Input
                accept="image/*"
                type="file"
                fullWidth
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                placeholder="Name"
                variant="filled"
                label="Name"
                color="primary"
                type="text"
                fullWidth="true"
                value={userData && userData.name}
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                placeholder="Bio"
                variant="filled"
                label="Bio"
                rowsMin={3}
                color="primary"
                type="textarea"
                fullWidth="true"
                value={userData && userData.bio}
                onChange={(e) => {
                  setUserData({ ...userData, bio: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="primary"
                variant="contained"
                fullWidth
                disabled={formLoading}
                onClick={(e) => submitChanges(e)}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Section>
  );
}

export default EditProfile;
