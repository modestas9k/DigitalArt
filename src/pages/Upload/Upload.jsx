import React, { useState } from "react";
import { Section, Input, Button } from "../../components";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "./Upload.scss";

function Upload() {
  const [image, setImage] = useState();
  const [fileError, setFileError] = useState();
  const [captionError, setCaptionError] = useState();
  const [progress, setProgress] = useState();
  const [caption, setCaption] = useState();
  const [message, setMessage] = useState();

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setFileError("");
    }
  };
  const handleUpload = () => {
    if (!caption) {
      return setCaptionError("No caption");
    }
    if (image) {
      const fileRef = firebase.storage().ref("images").child(image.name);

      const uploadTask = fileRef.put(image);

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
          setCaptionError(error.message);
        },
        () => {
          // complete function

          fileRef.getDownloadURL().then((url) => {
            // post image inside db
            firebase.firestore().collection("posts").add({
              timestamp: new Date(),
              username: firebase.auth().currentUser.displayName,
              userId: firebase.auth().currentUser.uid,
              userImage: firebase.auth().currentUser.photoURL,
              caption: caption,
              imageURL: url,
              imageRef: fileRef.fullPath,
            });
            setCaption("");
            setProgress("");
            setImage("");
            setMessage("Uploaded successfully!");
          });
        }
      );
    } else {
      setFileError("No file selected");
    }
  };

  return (
    <Section>
      <h1>Upload Image</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {message && (
          <div className="upload__message">
            <h2>{message}</h2>
          </div>
        )}
        <Input
          progress={progress}
          label="profile image"
          type="file"
          handleChange={handleChange}
          required
        >
          {fileError && <span>{fileError}</span>}
        </Input>
        <Input
          type="textarea"
          label="Caption"
          placeholder="Write caption about your work"
          handleChange={(e) => {
            setCaption(e.target.value);
            setCaptionError("");
          }}
          required
        >
          {captionError && <span>{captionError}</span>}
        </Input>
        <Button handleClick={handleUpload} className="button button-primary">
          Upload
        </Button>
      </form>
    </Section>
  );
}

export default Upload;
