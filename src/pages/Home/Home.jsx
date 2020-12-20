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
  makeStyles,
  Button,
} from "@material-ui/core";
import Masonry from "react-masonry-component";

const useStyles = makeStyles((theme) => ({
  homeWelcome: {
    height: "50vh",
    minHeight: "350px",
    color: "rgba(255, 255, 255, 0.945)",
    marginBottom: "16px",
  },
  header: {
    fontSize: "3.4rem",
  },
  TextField: {
    background: "rgba(255, 255, 255, 0.562)",
    borderRadius: "4px",
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

function Home(props) {
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchPosts, setSearchPosts] = useState();
  const classes = useStyles(props);

  useEffect(() => {
    defaultPosts();
  }, []);

  function defaultPosts() {
    return firebase
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
  function goSearch(e) {
    if (searchValue !== "") {
      firebase
        .firestore()
        .collection("posts")
        .where("caption", "array-contains", searchValue)
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
          <Typography className={classes.header} variant="h1">
            Digital Art
          </Typography>
          <Typography variant="subtitle1" color="inherit">
            Place where artists can share and sell there work. Powered by
            creators.
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e);
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

      <Container disableGutters>
        <Masonry className={classes.masonry}>
          {searchValue !== "" &&
            searchPosts &&
            searchPosts.map(({ id, post }) => {
              return (
                <div key={id} className={classes.postBox}>
                  <Post
                    userId={post.userId}
                    userImage={post.userImage}
                    username={post.username}
                    caption={post.caption}
                    imageURL={post.smallImageURL}
                  />
                </div>
              );
            })}

          {posts &&
            searchValue === "" &&
            posts.map(({ id, post }) => {
              return (
                <div key={id} className={classes.postBox}>
                  <Post
                    userId={post.userId}
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
  );
}

export default Home;
