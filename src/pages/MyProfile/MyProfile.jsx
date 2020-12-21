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
import Masonry from "react-masonry-component";

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
  image: {
    width: "100%",
    objectFit: "contain",
    borderRadius: 3,
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
  buttonBox: {
    display: "flex",
    justifyContent: "space-between",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
    },
  },
  postBox: {
    boxSizing: "border-box",
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "50%",
      padding: "0 8px",
    },
    [theme.breakpoints.up("md")]: {
      width: "33%",
    },
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
          {userData.name !== "" && (
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
      </Container>
      <Container disableGutters>
        <Masonry>
          {userPosts &&
            userPosts.map(({ id, post }) => {
              return (
                <div key={id} className={classes.postBox}>
                  <Post
                    key={id}
                    userId="myProfile"
                    userImage={post.userImage}
                    username={post.username}
                    caption={post.caption}
                    imageURL={post.smallImageURL}
                    handleDeleteButton={(e) => {
                      setDeleteModal(true);
                      setDeletedPostId({ id: id, ref: post.imageRef });
                    }}
                  />
                </div>
              );
            })}
        </Masonry>
      </Container>
    </>
  );
}

export default MyProfile;
