import React, { useEffect, useState, useContext } from "react";
import { Section, Button, Post } from "../../components";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "./MyProfile.scss";
import profileImage from "../../assets/user.svg";

function MyProfile() {
  const auth = useContext(AuthContext);

  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });
  const [userPosts, setUserPosts] = useState();
  const history = useHistory();

  useEffect(() => {
    let mounted = true;

    firebase.auth().onAuthStateChanged((user) => {
      if (user && mounted) {
        getUserPosts(user);

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
              });
            } else {
              console.log("not found");
            }
          });
      } else {
        console.log("no user");
      }
    });

    return () => (mounted = false);
  }, [auth]);

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

  return (
    <Section>
      <div className="profile-wrapper">
        <div className="image-wrapper">
          <img
            src={userData.profileImage || profileImage}
            alt="default profile"
          />
        </div>
        <div className="text-wrapper">
          <div className="username">
            {userData.name === "" && <h2> your first thing</h2>}
            {userData.name !== "" && <h2>{userData.name}</h2>}
            <Button
              className="button button-edit"
              handleClick={() => history.push("/editProfile")}
            >
              Edit profile
            </Button>
          </div>
          {userData.bio === "" && <p>Here u can add info</p>}
          {userData && <p>{userData.bio}</p>}
        </div>
      </div>
      <div className="profile__posts">
        {userPosts &&
          userPosts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                userImage={post.userImage}
                username={post.username}
                caption={post.caption}
                imageURL={post.imageURL}
              />
            );
          })}
      </div>
    </Section>
  );
}

export default MyProfile;
