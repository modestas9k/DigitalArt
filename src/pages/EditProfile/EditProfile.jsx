import React, { useEffect, useState, useContext } from "react";
import { Section, Button, Input } from "../../components";
import firebase from "firebase/app";
import "firebase/storage";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "./EditProfile.scss";
import defaultImage from "../../assets/user.svg";

function EditProfile() {
  const Auth = useContext(AuthContext);
  const history = useHistory();
  const [image, setImage] = useState();
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
        setUserData(data.data());
      });
  }, [Auth.state]);

  function submitChange(e) {
    e.preventDefault();
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
  function uploadImage(image) {
    const file = image;
    const metadata = file.type;
    const storageRef = firebase.storage().ref();

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = storageRef
      .child("images/" + file.name)
      .put(file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
          default:
            console.log("ups");
        }
      },
      function (error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            console.log("User doesn't have permission to access the object");
            break;

          case "storage/canceled":
            // User canceled the upload
            console.log("User canceled the upload");
            break;

          default:
            // Unknown error occurred, inspect error.serverResponse
            console.log("Unknown error occurred, inspect error.serverResponse");
            break;
        }
      },
      function () {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          setUserData({
            ...userData,
            profileImage: downloadURL,
          });
        });
      }
    );
  }

  return (
    <Section>
      <h1>Edit profile</h1>
      <div className="image-wrapper">
        <img
          className="profile-image"
          src={userData.profileImage || defaultImage}
          alt="profile"
        />
      </div>
      <div className="upload-input">
        <Input
          label="profile image"
          type="file"
          handleChange={(e) => setImage(e.target.files[0])}
        />
        <Button
          handleClick={() => uploadImage(image)}
          className="button button-primary"
        >
          Upload
        </Button>
      </div>
      <form>
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
          type="text"
          value={userData && userData.bio}
          handleChange={(e) =>
            setUserData({ ...userData, bio: e.target.value })
          }
        />
        <Button
          handleClick={(e) => submitChange(e)}
          className="button button-primary"
        >
          Save
        </Button>
      </form>
    </Section>
  );
}

export default EditProfile;
