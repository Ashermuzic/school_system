import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import AdminAttendanceViewTable from "../../components/datatable/AdminAttendanceViewTable";

const AttendanceViewList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <AdminAttendanceViewTable />
      </div>
    </div>
  );
};

export default AttendanceViewList;
