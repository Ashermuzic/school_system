import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import moment from "moment";
import "./attach.css";
import { AuthContext } from "../../context/authContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Write = () => {
  const [value, setValue] = useState("");
  const { currentUser } = useContext(AuthContext);

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
          <h2 className="title">Create a New Post with Attachment</h2>
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
          <label htmlFor="attachedFile" className="labelContainer">
            <p>Select a file to attach</p>
            <CloudUploadIcon className="icon" />
          </label>

          <input type="file" id="attachedFile" style={{ display: "none" }} />
          <button onClick={handlePublish}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default Write;
