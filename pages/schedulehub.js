import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '@/components/Dashboard/Navbar';
import { MdWorkHistory } from "react-icons/md";
import { useStateContext } from '@/context/StateContext'; 
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { database } from '@/backend/Firebase';

const logoColor = '#032c58';

const ScheduleHub = () => {
  const { user } = useStateContext(); 
  const [courseInput, setCourseInput] = useState('');
  const [courses, setCourses] = useState([]);
  const [courseTime, setCourseTime] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return; // not logged in

      try {
        const q = query(collection(database, "courses"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        
        const loadedCourses = [];
        querySnapshot.forEach((doc) => {
          loadedCourses.push(doc.data());
        });
        setCourses(loadedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [user]);

  const addCourse = async () => {
    // temporary logs
    console.log("add clicked");
    console.log("current user state: ", user);
    console.log("course input: ", courseInput);
    console.log("time: ", courseTime);

    if (courseInput.trim() === '' || courseTime === '' || !user) {
      console.log("Missing input or user is not logged in");
      alert("Please enter a course, a time, and ensure you are logged in.");
      return; 
    }

    console.log("Saving to firebase");

    const newCourse = {
      name: courseInput,
      time: courseTime,
      userId: user.uid 
    };

    try {
      // Saving
      await addDoc(collection(database, "courses"), newCourse);
      console.log("save successful");
      
      setCourses([...courses, newCourse]);
      setCourseInput('');
      setCourseTime('');
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save course to database.");
    }
  };

  return (
    <>
      <Navbar/>
      <Container>
        <Header>Schedule Hub</Header>
        <PresentCourses>
          {courses.length === 0 ? "No courses added. Add some!" : "Your Schedule"}
          <br/>
          <SuitcaseIcon></SuitcaseIcon>
          <InputContainer>
            <Input
              type="text"
              placeholder="Course (ex. CMPSC 263)"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
            />
            <Input
              type="time"
              value={courseTime}
              onChange={(e) => setCourseTime(e.target.value)}
            />
            <Button onClick={addCourse}>Add</Button>
          </InputContainer>
          
          <CourseList>
            {courses.map((course, index) => (
              <CourseItem key={index}>
                {course.name} — {course.time}
              </CourseItem>
            ))}
          </CourseList>

        </PresentCourses>
      </Container>
    </>
  )
}

const Container = styled.div`
  font-family: 'helvetica';
  background-color: #E8E9EA;
  width: 100%;
  min-height: 100vh;
`;

const Header = styled.div`
  background-color: ${logoColor};
  color: white;
  font-weight: bold;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const SuitcaseIcon = styled(MdWorkHistory)`
  justify-content: center;
  padding-right: .5rem;
  height: 4rem;
  width: 4rem;
`;

const PresentCourses = styled.div`
  padding: 5vh 10vh;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const Input = styled.input`
  height: 3rem;
  align-items: center;
  border: solid ${logoColor} 2px;
  text-align: center;
  font-size: 1rem;
  border-radius: 5px;
`;

const Button = styled.button`
  height: 3.5rem;
  font-size: 1rem;
  width: 4rem;
  border-radius: .5rem;
  border: solid ${logoColor} .2rem;
  background-color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${logoColor};
    color: white;
  }
`;

const CourseList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CourseItem = styled.div`
  font-size: 1.5rem;
  background-color: white;
  padding: 1rem;
  border-radius: 10px;
  border: 2px solid ${logoColor};
`;

export default ScheduleHub;