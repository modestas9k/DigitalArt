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
import GetAppIcon from "@material-ui/icons/GetApp";

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
  className,
  handleChipClick,
  freeDownload,
  handleDownloadChip,
}) {
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <Container disableGutters className={className}>
        <Box width="100%">
          <img className={classes.image} src={imageURL} alt={caption} />
        </Box>
        <Box>
          {/* Here ar 3 types of Post bottom that I use  */}
          {/* for home page */}
          {userId !== "myProfile" && userId !== "profile" && (
            <>
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
              {caption &&
                caption.map((cap) => {
                  return (
                    <Chip
                      className={classes.chip}
                      size="small"
                      label={cap}
                      key={cap}
                      clickable
                      onClick={() => handleChipClick(cap)}
                    />
                  );
                })}
            </>
          )}
          {/* for other ppl profile */}
          {userId === "profile" && (
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
            </>
          )}
          {/* for my Profile page */}
          {userId === "myProfile" && (
            <>
              <IconButton
                variant="text"
                color="default"
                onClick={handleDeleteButton}
              >
                <DeleteIcon />
              </IconButton>
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
            </>
          )}
          {freeDownload && (
            <IconButton
              onClick={handleDownloadChip}
              size="small"
              color="primary"
            >
              <GetAppIcon />
            </IconButton>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Post;
