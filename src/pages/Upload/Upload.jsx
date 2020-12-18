import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import {
  Paper,
  Container,
  Typography,
  Box,
  Button,
  Input,
  Checkbox,
  FormControlLabel,
  makeStyles,
  LinearProgress,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
  },
  spacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  input: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Upload() {
  const history = useHistory();
  const classes = useStyles();
  const [image, setImage] = useState();
  const [caption, setCaption] = useState([]);
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState();
  const [inProgress, setInProgress] = useState(false);
  const [captionError, setCaptionError] = useState();
  const [imageError, setImageError] = useState();

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };
  const handleChips = (chip) => {
    setCaption(chip);
  };
  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  function handleUpload() {
    setInProgress(true);
    setImageError("");
    setCaptionError("");

    if (!image) {
      setImageError("No image selected");
      setInProgress(false);
      return;
    }
    if (caption.length === 0) {
      setInProgress(false);
      setCaptionError("No caption");
      return;
    }
    if (image) {
      const fileRef = firebase.storage().ref("images").child(image.name);

      const uploadTask = fileRef.put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function
          const Progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(Progress);
        },
        (error) => {
          // error function
          console.log(error);
          setInProgress(false);
        },
        () => {
          // complete function
          fileRef
            .getDownloadURL()
            .then((url) => {
              // post image inside firestore
              firebase.firestore().collection("posts").add({
                timestamp: new Date(),
                username: firebase.auth().currentUser.displayName,
                userId: firebase.auth().currentUser.uid,
                userImage: firebase.auth().currentUser.photoURL,
                caption: caption,
                freeDownload: checked,
                imageURL: url,
                imageRef: fileRef.fullPath,
              });
            })
            .then(() => {
              setInProgress(false);
              history.push("/myProfile");
            });
        }
      );
    } else {
      setImageError("No file selected");
      setInProgress(false);
    }
  }

  return (
    <Container className={classes.root} disableGutters>
      <Paper>
        <Box p={2}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Typography gutterBottom variant="h4">
              Upload image
            </Typography>
            <FormControl className={classes.input} error={Boolean(imageError)}>
              <Input
                type="file"
                required
                className={classes.input}
                onChange={handleImage}
              />
              <FormHelperText>{imageError}</FormHelperText>
            </FormControl>
            <ChipInput
              error={Boolean(captionError)}
              helperText={captionError}
              label="Hit Enter to separate captions"
              variant="standard"
              className={classes.input}
              onChange={(chips) => handleChips(chips)}
            />

            <FormControlLabel
              className={classes.spacing}
              control={
                <Checkbox
                  checked={checked}
                  inputProps={{ "aria-label": "secondary checked" }}
                  onChange={handleChecked}
                />
              }
              label="Allow to download"
            />
            {progress && (
              <LinearProgress variant="determinate" value={progress} />
            )}
            <Button
              className={classes.spacing}
              onClick={() => handleUpload()}
              variant="contained"
              color="primary"
              fullWidth
              disabled={Boolean(inProgress)}
            >
              upload
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}

export default Upload;
