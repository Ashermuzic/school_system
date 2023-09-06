import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditStudent = ({ inputs, title }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    sex: "",
    grade: "",
    img: null,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/getStudent/${id}`)
      .then((res) => {
        const studentData = res.data.Result[0];
        setFormData({
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          age: studentData.age,
          sex: studentData.sex,
          grade: studentData.grade,
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
    formdata.append("age", formData.age);
    formdata.append("sex", formData.sex);
    formdata.append("grade", formData.grade);

    axios
      .put(`http://localhost:8081/updateStudent/${id}`, formData)
      .then((res) => {
        navigate("/students");
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

export default EditStudent;
