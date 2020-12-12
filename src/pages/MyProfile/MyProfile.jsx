import React, { useEffect, useState } from "react";
import { Section, Button, Post } from "../../components";
import profileImage from "../../assets/user.svg";
import "./MyProfile.scss";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useHistory } from "react-router-dom";

function MyProfile() {
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });
  const user = firebase.auth().currentUser;
  const [userPosts, setUserPosts] = useState();
  const history = useHistory();

  useEffect(() => {
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
    getUserPosts();
  }, [user]);

  function getUserPosts() {
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
