import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCyj6u_h91AiJPIuN6xl2qSW-fonQ_K2jA",
  authDomain: "vue-demo-c6fe6.firebaseapp.com",
  databaseURL: "https://vue-demo-c6fe6.firebaseio.com",
  projectId: "vue-demo-c6fe6",
  storageBucket: "vue-demo-c6fe6.appspot.com",
  messagingSenderId: "842483701941",
  appId: "1:842483701941:web:c23b1e0da66c91cfbb06fc",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
