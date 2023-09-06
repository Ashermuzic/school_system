import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditTeacher = ({ inputs, title }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    type: "",
    img: null,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/getTeacher/${id}`)
      .then((res) => {
        const studentData = res.data.Result[0];
        setFormData({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          subject: studentData.subject,
          type: studentData.type,
          img: studentData.img,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("name", formData.name);
    formdata.append("email", formData.email);
    formdata.append("phone", formData.phone);
    formdata.append("subject", formData.subject);
    formdata.append("type", formData.type);

    axios
      .put(`http://localhost:8081/updateTeacher/${id}`, formData)
      .then((res) => {
        navigate("/teachers");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img src={`http://localhost:8081/images/${formData.img}`} alt="" />
          </div>
          <div className="right">
            <form onSubmit={handleFormSubmit}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    value={formData[input.name]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTeacher;
