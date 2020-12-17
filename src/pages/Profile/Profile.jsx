import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Button,
  Avatar,
  Typography,
  Container,
  makeStyles,
  Grid,
} from "@material-ui/core";
import { Section, Post } from "../../components";
import { useHistory, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  button: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
  },
  profileWrapper: {
    display: "flex",
    marginTop: 20,
    marginBottom: 20,
  },
  avatarWrapper: {
    width: theme.spacing(17),
    height: theme.spacing(17),
    marginRight: 20,
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
      <Section>
        {profileData && (
          <>
            <Container className={classes.profileWrapper}>
              <div>
                <Avatar
                  className={classes.avatarWrapper}
                  src={profileData.profileImage}
                />
              </div>
              <div>
                <Typography variant="h4">{profileData.name}</Typography>
                <Typography variant="subtitle2">{profileData.bio} </Typography>
              </div>
            </Container>
            <Container>
              <Grid container spacing={2}>
                {userPosts &&
                  userPosts.map(({ id, post }) => {
                    return (
                      <Grid key={id} xs={12} sm={6} md={4} item>
                        <Post
                          key={id}
                          userId="#"
                          userImage={post.userImage}
                          username={post.username}
                          caption={post.caption}
                          imageURL={post.imageURL}
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </Container>
          </>
        )}
        {!profileData && (
          <Container>
            <Typography variant="h2">Sorry, no user found</Typography>
            <Button
              onClick={() => history.push("/")}
              className={classes.button}
            >
              Home
            </Button>
          </Container>
        )}
      </Section>
    </>
  );
}
