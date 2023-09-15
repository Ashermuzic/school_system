import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import AttendanceViewTable from "../../components/datatable/AttendanceViewTable";

const AttendanceViewList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <AttendanceViewTable />
      </div>
    </div>
  );
};

export default AttendanceViewList;
