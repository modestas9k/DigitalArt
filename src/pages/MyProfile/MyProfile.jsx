import React, { useEffect, useState, useContext } from "react";
import { Section, Button } from "../../components";
import profileImage from "../../assets/user.svg";
import "./MyProfile.scss";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function MyProfile() {
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });
  const Auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(Auth.state)
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
  }, [Auth]);

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
    </Section>
  );
}

export default MyProfile;
