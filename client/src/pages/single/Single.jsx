import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Single = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    sex: "",
    grade: "",
    img: "",
  });

  const { studentId } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/getStudent/${studentId}`)
      .then((res) => {
        setData({
          ...data,
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
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <Link to={`/students/edit/${studentId}`} className="editButton">
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
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Age:</span>
                  <span className="itemValue">{data.age}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Sex:</span>
                  <span className="itemValue">{data.sex}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Grade:</span>
                  <span className="itemValue">{data.grade}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="charts">
              <Chart aspect={3 / 1} title="Educational Performance" />
            </div>
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Subjects in rolled in</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Single;
