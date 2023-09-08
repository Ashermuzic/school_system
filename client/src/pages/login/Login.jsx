import "./login.scss";
import Girl from "../../assets/girl_laptop.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
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

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

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

                <button onClick={handleSubmit}>Submit</button>
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

                <button onClick={handleSubmit}>Submit</button>
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
              <div className="card">
                <h2>From MR.Samuel</h2>
                <hr />
                <p>
                  "Hello, class! As we embark on today's lesson, I want to
                  emphasize the power of perseverance. Learning can sometimes be
                  challenging, and you may encounter obstacles along the way.
                  But remember, it's those very challenges that help us grow and
                  develop resilience. Don't be discouraged by mistakes; they're
                  stepping stones to success. Take risks, be creative, and never
                  stop questioning the world around you. In this classroom, we
                  celebrate curiosity, and your questions are like keys that
                  unlock new doors of understanding. So, let's embrace the joy
                  of learning, support one another, and make every moment count.
                  Together, we'll achieve remarkable things!"
                </p>
                <h3>Posted 3 min ago</h3>
              </div>
              <div className="card">
                <h2>From Mrs.Liyu</h2>
                <hr />
                <p>
                  "Hello, class! As we embark on today's lesson, I want to
                  emphasize the power of perseverance. Learning can sometimes be
                  challenging, and you may encounter obstacles along the way.
                  But remember, it's those very challenges that help us grow and
                  develop resilience. Don't be discouraged by mistakes; they're
                  stepping stones to success. Take risks, be creative, and never
                  stop questioning the world around you. In this classroom, we
                  celebrate curiosity, and your questions are like keys that
                  unlock new doors of understanding. So, let's embrace the joy
                  of learning, support one another, and make every moment count.
                  Together, we'll achieve remarkable things!"
                </p>
                <h3>Posted 2 sec ago</h3>
              </div>
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
