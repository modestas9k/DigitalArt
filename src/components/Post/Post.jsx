import React from "react";
import {
  Container,
  makeStyles,
  Box,
  IconButton,
  Chip,
  Avatar,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  image: {
    width: "100%",
    objectFit: "contain",
    borderRadius: 3,
  },

  chip: {
    margin: theme.spacing(0.5),
  },
}));

function Post({
  imageURL,
  username,
  caption,
  userImage,
  userId,
  handleDeleteButton,
}) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Container disableGutters>
      <Box width="100%">
        <img className={classes.image} src={imageURL} alt={caption} />
      </Box>
      <Box>
        {/* Here ar 3 types of Post bottom that I use  */}
        {/* for home page */}
        {userId !== "myProfile" && userId !== "profile" && (
          <Chip
            className={classes.chip}
            avatar={<Avatar src={userImage}></Avatar>}
            label={username}
            variant="default"
            color="primary"
            clickable
            size="small"
            onClick={() => history.push(`/profile/${userId}`)}
          />
        )}
        {/* for other ppl profile */}
        {userId === "profile" && (
          <Chip
            className={classes.chip}
            avatar={<Avatar src={userImage}></Avatar>}
            label={username}
            variant="default"
            color="primary"
            clickable
            size="small"
          />
        )}
        {/* for my Profile page */}
        {userId === "myProfile" && (
          <>
            <Chip
              className={classes.chip}
              avatar={<Avatar src={userImage}></Avatar>}
              label={username}
              variant="default"
              color="primary"
              clickable
              size="small"
            />
            <IconButton
              variant="text"
              color="default"
              onClick={handleDeleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
        {caption &&
          caption.map((cap) => {
            return (
              <Chip
                className={classes.chip}
                size="small"
                label={cap}
                key={cap}
              />
            );
          })}
      </Box>
    </Container>
  );
}

export default Post;
