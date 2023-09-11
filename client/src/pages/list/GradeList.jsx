import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import GradeTable from "../../components/datatable/GradeTable";

const List = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <GradeTable />
      </div>
    </div>
  );
};

export default List;
