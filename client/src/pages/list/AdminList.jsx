import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import TeacherTable from "../../components/datatable/TeacherTable";
import AdminTable from "../../components/datatable/AdminTable";

const AdminList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <AdminTable />
      </div>
    </div>
  );
};

export default AdminList;
