import React, { useEffect, useState, useContext } from "react";
import { Section, Button, Input } from "../../components";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import firebase from "firebase/app";
import "firebase/storage";
import "./EditProfile.scss";
import defaultImage from "../../assets/user.svg";

function EditProfile() {
  const Auth = useContext(AuthContext);
  const history = useHistory();
  const [image, setImage] = useState();
  const [error, setError] = useState();
  const [progress, setProgress] = useState();
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(Auth.state)
      .get()
      .then((data) => {
        if (data.data()) {
          setUserData({
            name: data.data().name,
            bio: data.data().bio,
            profileImage: data.data().profileImage,
          });
        }
      });
  }, [Auth.state]);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (image) {
      const uploadTask = firebase
        .storage()
        .ref(`images/${image.name}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // error function
          console.log(error);
        },
        () => {
          // complete function
          firebase
            .storage()
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              // post image inside db
              setUserData({
                ...userData,
                profileImage: url,
              });
              // firebase.firestore().collection("users").doc(Auth.state).set({
              //   profileImage: url,
              // });
              setProgress("");
              setImage("");
            });
        }
      );
    } else {
      setError("First you need choose file");
    }
  };

  function updateUserProfile() {
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: userData.name,
        photoURL: userData.profileImage,
      })
      .then(() => {
        // Update successful.
        console.log("Auth updated");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  }

  function submitChanges(e) {
    e.preventDefault();

    updateUserProfile();

    firebase
      .firestore()
      .collection("users")
      .doc(Auth.state)
      .set({
        bio: userData.bio,
        name: userData.name,
        profileImage: userData.profileImage,
      })
      .then(() => history.push("/myProfile"));
  }

  return (
    <Section>
      <h1>Edit profile</h1>

      <div className="editProfile__wrapper">
        <div className="editProfile__image-wrapper">
          <img
            className="editProfile__image"
            src={userData.profileImage || defaultImage}
            alt="profile"
          />
        </div>
        <div className="editProfile__upload-input">
          <Input
            label="profile image"
            type="file"
            handleChange={handleChange}
            progress={progress}
          >
            {error && <span>{error}</span>}
          </Input>
          <Button
            handleClick={handleUpload}
            className="button button-primary max-150"
          >
            Upload
          </Button>
        </div>
      </div>

      <form className="editProfile__form">
        <Input
          label="Name"
          type="text"
          value={userData && userData.name}
          handleChange={(e) =>
            setUserData({ ...userData, name: e.target.value })
          }
        ></Input>
        <Input
          label="Bio"
          type="textarea"
          value={userData && userData.bio}
          handleChange={(e) =>
            setUserData({ ...userData, bio: e.target.value })
          }
        />
        <Button
          handleClick={(e) => submitChanges(e)}
          className="button button-primary"
        >
          Save
        </Button>
      </form>
    </Section>
  );
}

export default EditProfile;
