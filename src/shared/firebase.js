import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAH5Eb5m_rMy2nuEFdImc0TqjGCcrtz3X8",
    authDomain: "scheduler-3e528.firebaseapp.com",
    databaseURL: "https://scheduler-3e528.firebaseio.com",
    projectId: "scheduler-3e528",
    storageBucket: "scheduler-3e528.appspot.com",
    messagingSenderId: "225160104962",
    appId: "1:225160104962:web:9d19d669f8383bfd116b1b",
    measurementId: "G-3V81DQ45TE"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database().ref();
  
  export default firebase;
