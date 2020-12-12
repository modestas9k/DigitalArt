import React from "react";
import "./Post.scss";
import Avatar from "@material-ui/core/Avatar";

function Post({ imageURL, username, caption, userImage }) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={userImage} />
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageURL} alt="winter" />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
    </div>
  );
}

export default Post;
