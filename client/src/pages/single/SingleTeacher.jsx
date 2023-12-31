import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const SingleTeacher = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    img: "",
    subject: "",
    type: "",
  });

  const { teacherId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/getTeacher/${teacherId}`)
      .then((res) => {
        setData({
          ...data,
          name: res.data.Result[0].name,
          email: res.data.Result[0].email,
          phone: res.data.Result[0].phone,
          img: res.data.Result[0].img,
          subject: res.data.Result[0].subject,
          type: res.data.Result[0].type,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <Link to={`/teachers/edit/${teacherId}`} className="editButton">
              Edit
            </Link>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={`http://localhost:8081/images/${data.img}`}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data.email}</span>
                </div>{" "}
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Subject:</span>
                  <span className="itemValue">{data.subject}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Type:</span>
                  <span className="itemValue">{data.type}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default SingleTeacher;
