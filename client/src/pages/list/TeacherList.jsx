import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import TeacherTable from "../../components/datatable/TeacherTable";

const TeacherList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <TeacherTable />
      </div>
    </div>
  );
};

export default TeacherList;
