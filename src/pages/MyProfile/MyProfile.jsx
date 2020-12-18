import React, { useEffect, useState, useContext } from "react";
import { Post } from "../../components";
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
    marginBottom: 20,
    marginInline: "auto",
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
  const history = useHistory();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletedPostId, setDeletedPostId] = useState();
  const [userPosts, setUserPosts] = useState();
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

        getUserInfo(user);
      }
    });

    return () => (mounted = false);
  }, [auth]);

  function getUserInfo(user) {
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

  function deletePost(post) {
    const imageRefPath = firebase.storage().ref().child(post.ref);
    imageRefPath
      .delete()
      .then(() => {
        console.log("Success in storage deletion");
      })
      .catch((error) => console.log(error));

    const postRef = firebase.firestore().collection("posts").doc(post.id);
    postRef
      .delete()
      .then(() => console.log("success in firestore deletion"))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Container>
        <Modal
          className={classes.modal}
          open={deleteModal}
          onClose={() => setDeleteModal(false)}
        >
          <Paper className={classes.paper}>
            <Typography variant="h5">Delete this Post? </Typography>
            <div className={classes.root}>
              <Button
                onClick={() => {
                  deletePost(deletedPostId);
                  console.log(deletedPostId);
                  setDeleteModal(false);
                }}
                variant="contained"
                color="secondary"
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDeleteModal(false)}
              >
                No
              </Button>
            </div>
          </Paper>
        </Modal>
        <Grid container className={classes.profileWrapper}>
          <Grid item xs={5} sm={4}>
            <Avatar
              className={classes.avatarWrapper}
              src={userData.profileImage}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            {userData.name !== "" && (
              <>
                <Box
                  mx="auto"
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
                </Box>
                <Typography variant="subtitle2">{userData.bio} </Typography>
              </>
            )}
            {userData.name === "" && userData.bio === "" && (
              <Box>
                <Typography variant="body1">
                  You don't have any information about your self.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => history.push("/editProfile")}
                >
                  Get started
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Box marginBottom={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => history.push("/upload")}
          >
            Upload
          </Button>
        </Box>

        <Grid container spacing={2}>
          {userPosts && userPosts.length === 0 && (
            <Box mx="auto" mt={16}>
              <Typography variant="h6">No images added</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push("/upload")}
              >
                Upload image
              </Button>
            </Box>
          )}
          {userPosts &&
            userPosts.map(({ id, post }) => {
              return (
                <Grid key={id} xs={12} sm={6} md={4} item>
                  <Post
                    key={id}
                    userId="myProfile"
                    userImage={post.userImage}
                    username={post.username}
                    caption={post.caption}
                    imageURL={post.imageURL}
                    handleDeleteButton={(e) => {
                      setDeleteModal(true);
                      setDeletedPostId({ id: id, ref: post.imageRef });
                    }}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
}

export default MyProfile;
