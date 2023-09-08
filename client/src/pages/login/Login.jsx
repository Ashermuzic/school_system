import "./login.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import moment from "moment";
import PostContent from "./PostContent";

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [moveForm, setMoveForm] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const toggleMoveForm = () => {
    setMoveForm(!moveForm);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleAdminSubmit = (event) => {
  //   event.preventDefault();
  //   axios
  //     .post("http://localhost:8081/loginAdmin", inputs)
  //     .then((res) => {
  //       console.log(res.status);
  //       if (res.status === 200) {
  //         navigate("/");
  //       } else {
  //         setError(res.data.Error);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const { loginAdmin } = useContext(AuthContext);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  // const handleTeacherSubmit = (event) => {
  //   event.preventDefault();
  //   axios
  //     .post("http://localhost:8081/loginTeacher", inputs)
  //     .then((res) => {
  //       console.log(res.status);
  //       if (res.status === 200) {
  //         navigate("/");
  //       } else {
  //         setError(res.data.Error);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const { loginTeacher } = useContext(AuthContext);

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginTeacher(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/getPosts")
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="mainLogin">
      <div className="container">
        <div className="navbar">
          <div className="title">
            <h1>Info about the school</h1>
          </div>
          <div className="login">
            <button onClick={toggleLoginForm}>login</button>
          </div>

          <div className={`loginForm ${showLoginForm ? "slideDown" : ""}`}>
            <div className="loginContent">
              <div className="twoCards push">
                <h1>Login</h1>
                <input
                  type="text"
                  placeholder="Username"
                  name="name"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />

                <button onClick={handleTeacherSubmit}>Submit</button>
                <p onClick={toggleMoveForm}>but im an admin ?</p>
              </div>
              <div className={`twoCards dis-none ${moveForm ? "margin" : ""}`}>
                <h1>Admin</h1>
                <input
                  type="text"
                  placeholder="Username"
                  name="name"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                />

                <button onClick={handleAdminSubmit}>Submit</button>
                <p onClick={toggleMoveForm}>but im a teacher ?</p>
              </div>
            </div>
          </div>
        </div>
        <div className="home">
          <div className="left">
            <h1>Excellence in education</h1>
            <h2>
              Read about recent achievements, news, and
              <br />
              announcements.
            </h2>
            <p>
              Find contact information for the school office, administration,
              and teachers.
            </p>
          </div>
          <div className="right">
            <div className="girl"></div>
          </div>
        </div>
        <div className="newsSection">
          <div className="newsTitleSection">
            <h1>News Section</h1>
            <p>Read about recent achievements, news, and announcements.</p>
          </div>
          <div className="newsBody">
            <div className="cards">
              {posts.map((post) => {
                return (
                  <div className="card" key={post.id}>
                    <h2>From Mrs.{post.name}</h2>
                    <hr />
                    <PostContent content={post.desc} /> {/* p tag bug fixed*/}
                    <h3>{moment(post.date).fromNow()}</h3>
                  </div>
                );
              })}
            </div>
            <div className="sideTable">
              <table>
                <tr>
                  <th>Activity</th>
                  <th>Date</th>
                </tr>
                <tr>
                  <td>Registration for School</td>
                  <td>September 5, 2023</td>
                </tr>
                <tr>
                  <td>First Day of Classes</td>
                  <td>September 12, 2023</td>
                </tr>
                <tr>
                  <td>Parent-Teacher Meeting</td>
                  <td>October 20, 2023</td>
                </tr>
                <tr>
                  <td>Midterm Examinations</td>
                  <td>November 15-18, 2023</td>
                </tr>
                <tr>
                  <td>Final Exam Preparation</td>
                  <td>May 5-12, 2024</td>
                </tr>
                <tr>
                  <td>Final Examinations</td>
                  <td>May 13-20, 2024</td>
                </tr>
                <tr>
                  <td>Parent-Teacher Meeting</td>
                  <td>June 5, 2024</td>
                </tr>
                <tr>
                  <td>Last Day of School</td>
                  <td>June 10, 2024</td>
                </tr>
                <tr>
                  <td>Summer Vacation Begins</td>
                  <td>June 11, 2024</td>
                </tr>
                <tr>
                  <td>Graduation Ceremony</td>
                  <td>June 15, 2024</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
