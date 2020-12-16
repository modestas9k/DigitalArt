import React, { useEffect, useState, useContext } from "react";
import { Section } from "../../components";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  Container,
  Avatar,
  Grid,
  Typography,
  makeStyles,
  IconButton,
  Paper,
  Box,
  Modal,
  Button,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  profileWrapper: {
    display: "flex",
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    objectFit: "contain",
    borderRadius: 3,
  },
  avatarWrapper: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginRight: 20,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
  },
}));

function MyProfile() {
  const classes = useStyles();
  const auth = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState();
  const history = useHistory();
  const [modalState, setModalState] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    imageRef: "",
  });

  useEffect(() => {
    let mounted = true;

    firebase.auth().onAuthStateChanged((user) => {
      if (user && mounted) {
        getUserPosts(user);

        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.data()) {
              setUserData({
                name: doc.data().name,
                bio: doc.data().bio,
                profileImage: doc.data().profileImage,
                imageRef: doc.data().imageRef,
              });
            } else {
              console.log("not found");
            }
          });
      }
    });

    return () => (mounted = false);
  }, [auth]);

  function getUserPosts(user) {
    firebase
      .firestore()
      .collection("posts")
      .where("userId", "==", user.uid)
      .onSnapshot((snapshot) => {
        setUserPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }

  function deletePost(postId, imageRef) {
    const imageRefPath = firebase.storage().ref().child(imageRef);
    imageRefPath
      .delete()
      .then(() => {
        console.log("Success in storage deletion");
      })
      .catch((error) => console.log(error));

    const postRef = firebase.firestore().collection("posts").doc(postId);
    postRef
      .delete()
      .then(() => console.log("success in firestore deletion"))
      .catch((err) => console.log(err));
  }

  return (
    <Section>
      <Container className={classes.profileWrapper}>
        <div>
          <Avatar
            className={classes.avatarWrapper}
            src={userData.profileImage}
          />
        </div>
        <Container>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h4">{userData.name}</Typography>
            <IconButton onClick={() => history.push("/editProfile")}>
              <SettingsIcon />
            </IconButton>
          </div>
          <Typography variant="subtitle2">{userData.bio} </Typography>
        </Container>
      </Container>
      <Container>
        <Grid container spacing={2}>
          {userPosts &&
            userPosts.map(({ id, post }) => {
              return (
                <Grid key={id} xs={12} sm={6} md={4} item>
                  <Paper>
                    <Box width="100%">
                      <img
                        className={classes.image}
                        src={post.imageURL}
                        alt={post.imageRef}
                      />
                    </Box>
                    <Container
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {post.caption}
                      </Typography>
                      <IconButton
                        variant="text"
                        color="default"
                        onClick={(e) => {
                          setModalState(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Modal
                        className={classes.modal}
                        open={modalState}
                        onClose={() => setModalState(false)}
                      >
                        <Paper className={classes.paper}>
                          <Typography variant="h5">
                            Delete this Post?
                          </Typography>
                          <div className={classes.root}>
                            <Button
                              onClick={() => deletePost(id, post.imageRef)}
                              variant="contained"
                              color="secondary"
                            >
                              Yes
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setModalState(false)}
                            >
                              No
                            </Button>
                          </div>
                        </Paper>
                      </Modal>
                    </Container>
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </Section>
  );
}

export default MyProfile;
