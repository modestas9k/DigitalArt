import React, { useState, useEffect } from "react";
import { Section, Post } from "../../components";
import firebase from "firebase/app";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <>
      <Section>
        <h1>Home</h1>
        {posts &&
          posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                username={post.username}
                caption={post.caption}
                imageURL={post.imageURL}
              />
            );
          })}
      </Section>
    </>
  );
}

export default Home;
