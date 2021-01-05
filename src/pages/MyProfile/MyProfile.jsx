import React, { useEffect, useState, useContext } from "react";
import { Post, ProfileBox } from "../../components";
import { AuthContext } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  Container,
  Typography,
  makeStyles,
  Paper,
  Modal,
  Button,
} from "@material-ui/core";
import Masonry from "react-masonry-component";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: theme.spacing(2),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
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
  const history = useHistory();
  const auth = useContext(AuthContext);
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
            <Typography variant="caption">
              Image will be deleted from storage
            </Typography>
            <div className={classes.buttons}>
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
        <ProfileBox userData={userData} myProfile={true} />
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
                    handleChipClick={(cap) => {
                      history.push("/?query=" + cap);
                    }}
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
