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
import { Link } from "react-router-dom";

const Write = () => {
  const [value, setValue] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handlePublish = async () => {
    try {
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

      const formData = new FormData();
      formData.append("desc", value);
      formData.append("date", currentDate);
      formData.append("name", currentUser);
      formData.append("file", selectedFile); // Attach the selected file

      await axios.post("http://localhost:8081/uploadTeacherFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for file uploads
        },
      });

      setValue("");
      setSelectedFile(null);
      setIsPostSuccessful(true);
    } catch (error) {
      console.error("Error publishing post:", error);
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

          <input
            type="file"
            id="attachedFile"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {isPostSuccessful && (
            <div className="successMessage">
              <h3>File posted successfully!!</h3>
              <Link to="/" style={{ textDecoration: "none" }}>
                <p>{`( view post )`}</p>
              </Link>
            </div>
          )}
          <button onClick={handlePublish}>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default Write;
