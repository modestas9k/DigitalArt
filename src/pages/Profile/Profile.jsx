import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Button,
  Avatar,
  Typography,
  Container,
  makeStyles,
  Box,
} from "@material-ui/core";
import { Post } from "../../components";
import { useHistory, useParams } from "react-router-dom";
import Masonry from "react-masonry-component";

const useStyles = makeStyles((theme) => ({
  profileWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(8),
  },
  avatarWrapper: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginRight: 20,
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

export default function Profile(props) {
  const history = useHistory();
  const [profileData, setProfileData] = useState();
  const [userPosts, setUserPosts] = useState();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    let mounted = true;

    if (id && mounted) {
      firebase
        .firestore()
        .collection("users")
        .doc(id)
        .get()
        .then((data) => {
          if (data) {
            setProfileData(data.data());
          } else {
            console.log("fail");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .where("userId", "==", id)
        .onSnapshot((snapshot) => {
          setUserPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
          );
        });
    }

    return () => (mounted = false);
  }, [id]);

  return (
    <>
      {profileData && (
        <>
          <Container className={classes.profileWrapper}>
            <Box>
              <Avatar
                className={classes.avatarWrapper}
                src={profileData.profileImage}
              />
            </Box>
            <Box>
              <Typography variant="h4">{profileData.name}</Typography>
              <Typography variant="subtitle2">{profileData.bio} </Typography>
            </Box>
          </Container>
          <Container>
            <Masonry>
              {userPosts &&
                userPosts.map(({ id, post }) => {
                  return (
                    <div key={id} className={classes.postBox}>
                      <Post
                        key={id}
                        userId="profile"
                        userImage={post.userImage}
                        username={post.username}
                        caption={post.caption}
                        imageURL={post.smallImageURL}
                      />
                    </div>
                  );
                })}
            </Masonry>
          </Container>
        </>
      )}
      {!profileData && (
        <Container>
          <Typography variant="h2">Sorry, no user found</Typography>
          <Button onClick={() => history.push("/")} className={classes.button}>
            Home
          </Button>
        </Container>
      )}
    </>
  );
}
