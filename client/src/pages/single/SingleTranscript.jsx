import React, { useEffect, useState } from "react";
import "./singleTranscript.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Logo from "../../assets/bg04.png";
import jung from "../../assets/jung.jpg";
import axios from "axios";
import { useParams } from "react-router-dom";

const StudentTranscript = () => {
  const [data, setData] = useState([]);
  // Hardcoded student data
  const studentData = {
    name: "John Doe",
    studentID: "12345",
    sex: "M",
    age: "18",
    studentGrade: "12",
    courses: [
      { courseName: "Mathematics", grade: "A", cont: 17, mid: 20, final: 34 },
      { courseName: "History", grade: "B", cont: 13, mid: 18, final: 36 },
      { courseName: "Science", grade: "A-", cont: 9, mid: 20, final: 38 },
      { courseName: "Biology", grade: "A-", cont: 9, mid: 20, final: 38 },
      { courseName: "History", grade: "B", cont: 13, mid: 18, final: 36 },
      { courseName: "Mathematics", grade: "A", cont: 17, mid: 20, final: 34 },
      { courseName: "English", grade: "A-", cont: 9, mid: 20, final: 38 },
      // Add more courses as needed
    ],
    totalCredits: 15, // Total credits completed
  };

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/getStudent/${id}`)
      .then((res) => {
        setData({
          ...data,
          id: res.data.Result[0].id,
          name: res.data.Result[0].name,
          email: res.data.Result[0].email,
          phone: res.data.Result[0].phone,
          age: res.data.Result[0].age,
          sex: res.data.Result[0].sex,
          grade: res.data.Result[0].grade,
          img: res.data.Result[0].img,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />

        <div className="student-transcript">
          <div className="header">
            <div className="schoolLogo">
              <img src={Logo} alt="" />
            </div>
            <div className="schoolDesc">
              <h1>Maplewood High School</h1>
              <h2>Cultivating Excellence, Nurturing Tomorrow</h2>
              <p>
                We embrace technology as a powerful tool for learning, with
                classrooms <br />
                equipped for digital education
              </p>
            </div>
          </div>

          <div className="infoSection">
            <div className="written">
              <h2>Student Transcript</h2>
              <div className="student-info">
                <p>Name: {data.name}</p>
                <p>Student ID: {data.id}</p>
                <p>Sex: {data.sex}</p>
                <p>Age: {data.age}</p>
                <p>Grade: {data.grade}</p>
                <p></p>
              </div>
            </div>
            <div className="studentImg">
              <img src={`http://localhost:8081/images/${data.img}`} alt="" />
            </div>
          </div>
          <div className="semester">
            <p className="term">First semester</p>
            <table className="course-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Grade</th>
                  <th>Continuos</th>
                  <th>Mid term</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {studentData.courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.courseName}</td>
                    <td>{course.grade}</td>
                    <td>{course.cont}</td>
                    <td>{course.mid}</td>
                    <td>{course.final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="semester">
            <p className="term" style={{ marginTop: "60px" }}>
              Second semester
            </p>
            <table className="course-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Grade</th>
                  <th>Continuos</th>
                  <th>Mid term</th>
                  <th>Final</th>
                </tr>
              </thead>
              <tbody>
                {studentData.courses.map((course, index) => (
                  <tr key={index}>
                    <td>{course.courseName}</td>
                    <td>{course.grade}</td>
                    <td>{course.cont}</td>
                    <td>{course.mid}</td>
                    <td>{course.final}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTranscript;
