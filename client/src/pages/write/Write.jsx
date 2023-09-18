import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import moment from "moment";
import "./write.css";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

const Write = () => {
  const [value, setValue] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);

  const handlePublish = async () => {
    try {
      // Get the current date and time using moment.js
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

      console.log("Current Date:", currentDate);

      // Send a POST request with the message content and date
      await axios.post("http://localhost:8081/publishPost", {
        desc: value,
        date: currentDate,
        name: currentUser,
      });

      // Optionally, you can clear the editor after successful submission
      setValue("");
      setIsPostSuccessful(true);

      // You can also redirect the user or show a success message here
    } catch (error) {
      console.error("Error publishing post:", error);

      // Handle any errors that occur during the request
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="titleContainer">
          <h2 className="title">Write Your Message Below</h2>
        </div>
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
        <div className="buttonContainer">
          <div>
            {isPostSuccessful && (
              <div className="successMessage">
                <h3>Message posted successfully!!</h3>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <p>{`( view post )`}</p>
                </Link>
              </div>
            )}
          </div>
          <button onClick={handlePublish}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default Write;
