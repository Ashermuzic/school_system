import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { TeacherColumns } from "../../datatablesource"; // Remove userRows import
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const TeacherTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/getTeachers")
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const { userId } = useParams(); // Access the userId parameter from the URL

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:8081/deleteTeacher/" + id)
      .then((res) => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
        } else {
          alert("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Use dynamic Link to navigate to Single component */}
            <Link
              to={`/teachers/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        View Teacher
        <Link to="/teachers/new" className="link">
          Add Teacher
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={TeacherColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default TeacherTable;
