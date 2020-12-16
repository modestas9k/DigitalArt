import React from "react";
import {
  Paper,
  Button,
  Typography,
  makeStyles,
  Box,
  Container,
  IconButton,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles({
  image: {
    width: "100%",
    objectFit: "contain",
    borderRadius: 3,
  },
  myProfile: {
    display: "flex",
    alignItems: "center",
    //justifyItems: "space-around",
  },
});

function Post({ imageURL, username, caption, userImage, userId }) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Paper>
      <Box width="100%">
        <img className={classes.image} src={imageURL} alt={caption} />
      </Box>
      <div style={{ display: "flex" }}>
        {userId && userId === "#" && (
          <Container>
            <Typography variant="subtitle2">{caption}</Typography>
          </Container>
        )}
        {userId.length > 1 && (
          <>
            <Button
              variant="text"
              color="primary"
              onClick={() => history.push(`/profile/${userId}`)}
            >
              {username}
            </Button>
            <Typography variant="subtitle2" style={{ alignSelf: "center" }}>
              {caption}
            </Typography>
          </>
        )}
      </div>
    </Paper>
  );
}

export default Post;
