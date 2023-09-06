import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import NewStudent from "./pages/new/NewStudent";
import NewTeacher from "./pages/new/NewTeacher";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import TeacherList from "./pages/list/TeacherList";
import AdminList from "./pages/list/AdminList";
import SingleTeacher from "./pages/single/SingleTeacher";
import SingleAdmin from "./pages/single/SingleAdmin";
import EditStudent from "./pages/edit/EditStudent";
import EditTeacher from "./pages/edit/EditTeacher";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
