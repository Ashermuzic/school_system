import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Attendance from "../../components/datatable/Attendance";

const AttendanceList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <Attendance />
      </div>
    </div>
  );
};

export default AttendanceList;
