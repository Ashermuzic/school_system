import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";

const List = ({ searchSubject }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch top-scoring students data
    axios
      .get(`http://localhost:8081/top-scoring-student/${searchSubject}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        } else {
          console.error("Error fetching top-scoring students' data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching top-scoring students' data:", error);
      });
  }, [searchSubject]);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Student ID</TableCell>
            <TableCell className="tableCell">Student Name</TableCell>
            <TableCell className="tableCell">Grade</TableCell>
            <TableCell className="tableCell">Sex</TableCell>
            <TableCell className="tableCell">Age</TableCell>
            <TableCell className="tableCell">Total Points</TableCell>
            <TableCell className="tableCell">Subject</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.student_id}>
              <TableCell className="tableCell">{row.student_id}</TableCell>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img
                    src={`http://localhost:8081/images/${row.student_img}`}
                    alt=""
                    className="image"
                  />
                  {row.student_name}
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.grade}</TableCell>
              <TableCell className="tableCell">{row.sex}</TableCell>
              <TableCell className="tableCell">{row.age}</TableCell>
              <TableCell className="tableCell">{row.total_score}</TableCell>
              <TableCell className="tableCell">
                <span className={`status Approved`}>{row.subject_name}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
