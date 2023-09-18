import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import NewStudent from "./pages/new/NewStudent";
import NewTeacher from "./pages/new/NewTeacher";
import TeacherList from "./pages/list/TeacherList";
import AdminList from "./pages/list/AdminList";
import GradeList from "./pages/list/GradeList";
import AttendanceList from "./pages/list/AttendanceList";
import AttendanceViewList from "./pages/list/AttendanceViewList";
import AdminAttendanceViewList from "./pages/list/AdminAttendanceViewList";
import SingleTeacher from "./pages/single/SingleTeacher";
import SingleAdmin from "./pages/single/SingleAdmin";
import EditStudent from "./pages/edit/EditStudent";
import EditTeacher from "./pages/edit/EditTeacher";
import Stats from "./pages/stats/Stats";
import Write from "./pages/write/Write";
import AttachFile from "./pages/attach/AttachFile";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import Attendance from "./components/datatable/Attendance";
import ProfileList from "./pages/list/ProfileList";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { currentUserRole, currentUser } = useContext(AuthContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          {/* Set the login page as the default route */}
          <Route path="/" element={<Login />} />
          {currentUser && <Route path="dashboard" element={<Home />} />}

          {currentUser && (
            <Route path="students">
              <Route index element={<List />} />
              <Route path=":studentId" element={<Single />} />
              <Route
                path="new"
                element={
                  <NewStudent inputs={userInputs} title="Add New Student" />
                }
              />
              <Route
                path="edit/:id"
                element={
                  <EditStudent inputs={userInputs} title="Edit The Student" />
                }
              />
            </Route>
          )}

          {currentUser && (
            <Route path="teachers">
              <Route index element={<TeacherList />} />
              <Route path=":teacherId" element={<SingleTeacher />} />
              <Route
                path="new"
                element={
                  <NewTeacher inputs={productInputs} title="Add New Teacher" />
                }
              />
              <Route
                path="edit/:id"
                element={
                  <EditTeacher
                    inputs={productInputs}
                    title="Edit The Teacher"
                  />
                }
              />
            </Route>
          )}

          {currentUser && (
            <Route path="admins">
              <Route index element={<AdminList />} />
              <Route path=":adminId" element={<SingleAdmin />} />
              <Route
                path="new"
                element={
                  <NewStudent inputs={productInputs} title="Add New Product" />
                }
              />
            </Route>
          )}

          {currentUser && (
            <Route path="stats">
              <Route index element={<Stats />} />
            </Route>
          )}

          {currentUser && (
            <Route path="write">
              <Route index element={<Write />} />
            </Route>
          )}

          {currentUser && (
            <Route path="attachFile">
              <Route index element={<AttachFile />} />
            </Route>
          )}

          {currentUser && (
            <Route path="myStudents">
              <Route index element={<GradeList />} />
            </Route>
          )}

          {currentUser && (
            <Route path="attendance">
              <Route index element={<AttendanceList />} />
            </Route>
          )}

          {currentUser && (
            <Route path="attendanceView">
              <Route index element={<AttendanceViewList />} />
            </Route>
          )}

          {currentUser && (
            <Route path="adminAttendanceView">
              <Route index element={<AdminAttendanceViewList />} />
            </Route>
          )}

          {currentUser && (
            <Route path="profile">
              <Route index element={<ProfileList />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
