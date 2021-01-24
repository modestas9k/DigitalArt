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
  Box,
  Chip,
} from "@material-ui/core";
import Masonry from "react-masonry-component";
import { useHistory, useLocation } from "react-router-dom";

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
  chip: {
    marginTop: theme.spacing(4),
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

function useSearch() {
  return new URLSearchParams(useLocation().search);
}
function Home(props) {
  const history = useHistory();
  const [posts, setPosts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchPosts, setSearchPosts] = useState();
  const classes = useStyles(props);
  let params = useSearch();
  if (searchValue === "" && params.get("query")) {
    setSearchValue(params.get("query"));
    history.push("/");
  }
  useEffect(() => {
    defaultPosts();
  }, []);

  useEffect(() => {
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
  }, [searchValue]);

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

  const handleChipClicks = (cap) => {
    setSearchValue(cap);
  };
  const handleDownloadChip = (imageRef) => {
    if (imageRef) {
      firebase
        .storage()
        .ref(imageRef)
        .getDownloadURL()
        .then((url) => {
          let xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function () {
            let ref = firebase.storage().ref(imageRef);
            let blob = xhr.response;
            let el = document.createElement("a");
            el.href = URL.createObjectURL(blob);
            el.download = ref.name;
            el.click();
          };
          xhr.open("GET", url);
          xhr.send();
        })
        .catch(function (error) {
          switch (error.code) {
            case "storage/object-not-found":
              console.log("Not found");
              break;

            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              break;

            case "storage/canceled":
              console.log("User canceled the upload");
              break;

            default:
              console.log(
                "Unknown error occurred, inspect the server response"
              );
              break;
          }
        });
    }
  };

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

          {searchValue && (
            <div>
              <Chip
                className={classes.chip}
                label={searchValue}
                variant="default"
                color="default"
                onDelete={() => setSearchValue("")}
              />
            </div>
          )}
          <TextField
            className={classes.TextField}
            label="Search..."
            color="primary"
            margin="normal"
            variant="filled"
            fullWidth={true}
            onChange={(e) => setSearchValue(e.target.value)}
          />
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
                    freeDownload={post.freeDownload}
                    handleChipClick={(cap) => handleChipClicks(cap)}
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
                    handleChipClick={(cap) => handleChipClicks(cap)}
                    freeDownload={post.freeDownload}
                    handleDownloadChip={() => handleDownloadChip(post.imageRef)}
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
