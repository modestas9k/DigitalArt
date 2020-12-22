import React, { useState, useEffect } from "react";
import { ProfileBox, Loading } from "../../components";
import firebase from "firebase/app";
import "firebase/firestore";
import { Container, makeStyles } from "@material-ui/core";
import { Post } from "../../components";
import { useParams } from "react-router-dom";
import Masonry from "react-masonry-component";

const useStyles = makeStyles((theme) => ({
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

export default function Profile() {
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
          <ProfileBox userData={profileData} />

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
          <Loading />
        </Container>
      )}
    </>
  );
}
