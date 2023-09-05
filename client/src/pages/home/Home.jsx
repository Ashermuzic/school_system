import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [adminCount, setAdminCount] = useState();
  const [studentCount, setStudentCount] = useState();
  const [teacherCount, setTeacherCount] = useState();

  useEffect(() => {
    axios.get("http://localhost:8081/adminCount").then((res) => {
      setAdminCount(res.data[0].admin);
    });

    axios.get("http://localhost:8081/studentCount").then((res) => {
      setStudentCount(res.data[0].student);
    });

    axios
      .get("http://localhost:8081/teacherCount")
      .then((res) => {
        setTeacherCount(res.data[0].teacher);
      })

      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="students" amount={studentCount} diff={20} />
          <Widget type="teachers" amount={teacherCount} diff={20} />
          <Widget type="admin" amount={adminCount} diff={20} />
          <Widget type="balance" amount={101} diff={20} />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Top Scoring Students</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
