import React, { useState, useEffect } from "react";
import { Section, Post } from "../../components";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "./Home.scss";
import {
  TextField,
  Typography,
  Container,
  Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  homeWelcome: {
    marginTop: "-21px",
    height: (props) => (props.small ? "20vh" : "60vh"),
    color: "rgb(235, 235, 235)",
    marginBottom: "16px",
  },
  TextField: {
    background: "rgb(235, 235, 235)",
  },
});

function Home(props) {
  const [posts, setPosts] = useState([]);
  const classes = useStyles(props);

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <>
      <Section className="home__welcome">
        <Container className={classes.homeWelcome}>
          <Typography component="div" style={{ height: "10vh" }} />
          <Typography variant="h1">Digital Art</Typography>
          <Typography variant="subtitle1" color="inherit">
            Place where artists can share and sell there work. Powered by
            creators.
          </Typography>

          <TextField
            className={classes.TextField}
            label="Search..."
            color="primary"
            margin="normal"
            variant="filled"
            fullWidth={true}
          />
        </Container>
      </Section>
      <Section>
        <Grid container spacing={2}>
          {posts &&
            posts.map(({ id, post }) => {
              return (
                <Grid key={id} xs={12} sm={6} md={4} item>
                  <Post
                    key={id}
                    userImage={post.userImage}
                    username={post.username}
                    caption={post.caption}
                    imageURL={post.imageURL}
                  />
                </Grid>
              );
            })}
        </Grid>
      </Section>
    </>
  );
}

export default Home;
