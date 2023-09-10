import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const loginAdmin = async (inputs) => {
    const res = await axios.post("http://localhost:8081/loginAdmin", inputs);
    setCurrentUserRole(res.data.role);
    setCurrentUser(res.data.name);
  };

  const loginTeacher = async (inputs) => {
    const res = await axios.post("http://localhost:8081/loginTeacher", inputs);
    setCurrentUserRole(res.data.role);
    setCurrentUser(res.data.name);
  };

  const logout = async (inputs) => {
    await axios.get("http://localhost:8081/logout");
    setCurrentUserRole(null);
  };

  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(currentUserRole, currentUser));
  // }, [currentUserRole, currentUser]);

  useEffect(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({ role: currentUserRole, name: currentUser })
    );
  }, [currentUserRole, currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUserRole, currentUser, loginAdmin, loginTeacher, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
