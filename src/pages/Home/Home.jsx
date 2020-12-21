import React, { useState, useEffect } from "react";
import { Post } from "../../components";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  TextField,
  Typography,
  Container,
  makeStyles,
  Button,
  Box,
} from "@material-ui/core";
import Masonry from "react-masonry-component";

const useStyles = makeStyles((theme) => ({
  welcomeBg: {
    backgroundImage: "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
  },
  homeWelcome: {
    minHeight: "350px",
    maxHeight: "450px",
    color: "rgba(255, 255, 255, 0.945)",
    marginBottom: theme.spacing(2),
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
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
      <Box className={classes.welcomeBg}>
        <Container className={classes.homeWelcome}>
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
      </Box>

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
