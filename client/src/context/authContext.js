import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const loginAdmin = async (inputs) => {
    const res = await axios.post("http://localhost:8081/loginAdmin", inputs);
    setCurrentUserRole(res.data.role);
  };

  const loginTeacher = async (inputs) => {
    const res = await axios.post("http://localhost:8081/loginTeacher", inputs);
    setCurrentUserRole(res.data.role);
  };

  const logout = async (inputs) => {
    await axios.post("/auth/logout");
    setCurrentUserRole(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUserRole));
  }, [currentUserRole]);

  return (
    <AuthContext.Provider value={{ currentUserRole, loginAdmin, loginTeacher }}>
      {children}
    </AuthContext.Provider>
  );
};
