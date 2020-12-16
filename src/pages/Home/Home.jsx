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
  Button,
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
  const [searchValue, setSearchValue] = useState("");
  const [searchPosts, setSearchPosts] = useState();
  const classes = useStyles(props);

  useEffect(() => {
    defaultPosts();
  }, []);

  function defaultPosts() {
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
  }
  function goSearch() {
    console.log(searchValue);
    if (searchValue !== "") {
      firebase
        .firestore()
        .collection("posts")
        .where("username", "==", searchValue)
        .get()
        .then((snapshot) => {
          setSearchPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
          );
        });
    }
  }

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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goSearch(e);
            }}
          >
            <TextField
              className={classes.TextField}
              label="Search..."
              color="primary"
              margin="normal"
              variant="filled"
              fullWidth={true}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button type="submit" color="primary" variant="contained">
              Search
            </Button>
          </form>
        </Container>
      </Section>
      <Section>
        <Grid container spacing={2}>
          {searchValue !== "" &&
            searchPosts &&
            searchPosts.map(({ id, post }) => {
              return (
                <Grid key={id} xs={12} sm={6} md={4} item>
                  <Post
                    key={id}
                    userId={post.userId}
                    userImage={post.userImage}
                    username={post.username}
                    caption={post.caption}
                    imageURL={post.imageURL}
                  />
                </Grid>
              );
            })}
          {posts &&
            searchPosts !== "" &&
            posts.map(({ id, post }) => {
              return (
                <Grid key={id} xs={12} sm={6} md={4} item>
                  <Post
                    key={id}
                    userId={post.userId}
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
