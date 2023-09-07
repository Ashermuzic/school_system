import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import "./write.css";

const Write = () => {
  const [value, setValue] = useState("");

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
          <button>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default Write;
