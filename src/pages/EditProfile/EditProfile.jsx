import React, { useEffect, useState, useContext } from "react";
import { Section, Button, Input } from "../../components";
import firebase from "firebase/app";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function EditProfile() {
  const Auth = useContext(AuthContext);
  const history = useHistory();
  //const [image, setImage] = useState();
  const [userData, setUserData] = useState({
    name: "",
    bio: "",
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
      })
      .then(() => history.push("/myProfile"));
  }
  return (
    <Section>
      {/* <Input
        label="profile image"
        type="file"
        handleChange={(e) => setImage(e.target.files[0])}
      />
      <Button handleClick={console.log(image)}>Upload</Button> */}
      <form>
        <h1>Edit profile</h1>

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
