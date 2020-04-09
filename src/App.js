import firebase from './shared/firebase.js';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React,
       {useState, useEffect} from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Message} from 'rbx';
import CourseList from './components/CourseList';


const db = firebase.database().ref();

const schedule = {
  "title": "CS Courses for 2018-2019",
  "courses": [
    {
      "id": "F101",
      "title": "Computer Science: Concepts, Philosophy, and Connections",
      "meets": "MWF 11:00-11:50"
    },
    {
      "id": "F110",
      "title": "Intro Programming for non-majors",
      "meets": "MWF 10:00-10:50"
    },
    {
      "id": "F111",
      "title": "Fundamentals of Computer Programming I",
      "meets": "MWF 13:00-13:50"
    },
    {
      "id": "F211",
      "title": "Fundamentals of Computer Programming II",
      "meets": "TuTh 12:30-13:50"
    }
  ]
};

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});

const App = () =>  {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  // const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const fetchSchedule = async () => {
  //     const response = await fetch(url);
  //     if(!response.ok) throw response;
  //     const json = await response.json();
  //     setSchedule(addScheduleTimes(json));
  //   }
  //   fetchSchedule();
  // }, [])
  useEffect(() => {
    const handleData = snap => {
      if(snap.val()) setSchedule(addScheduleTimes(snap.val()));
    }
    db.on('value', handleData, error => alert(error));
    return () => {db.off('value', handleData);};
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);
  return (
    <Container>
      <Banner title = {schedule.title} user = {user}/>
      <CourseList courses = {schedule.courses} user = {user}/>
    </Container>
  )
};

const Banner = ({user, title}) => (
  <React.Fragment>
    {user ? <Welcome user = {user}/> : <SignIn/>}
    <Title>{title || '[loading...]'}</Title>
  </React.Fragment>
);

const Welcome = ({user}) => (
  <Message color = "info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primariy onClick = {() => firebase.auth().signOut()}>
        Log Out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

export default App;