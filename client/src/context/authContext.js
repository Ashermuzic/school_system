import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Parse the user data from localStorage or set it to null if it doesn't exist
  const initialUser = JSON.parse(localStorage.getItem("user")) || {
    name: null,
    role: null,
    id: null,
  };

  const [currentUserRole, setCurrentUserRole] = useState(initialUser.role);
  const [currentUser, setCurrentUser] = useState(initialUser.name);
  const [currentTeacherId, setCurrentTeacherId] = useState(initialUser.id);

  const loginAdmin = async (inputs) => {
    const res = await axios.post("http://localhost:8081/loginAdmin", inputs);
    setCurrentUserRole(res.data.role);
    setCurrentUser(res.data.name);
  };

  const loginTeacher = async (inputs) => {
    const res = await axios.post("http://localhost:8081/loginTeacher", inputs);
    setCurrentUserRole(res.data.role);
    setCurrentUser(res.data.name);
    setCurrentTeacherId(res.data.id);
  };

  const logout = async (inputs) => {
    await axios.get("http://localhost:8081/logout");
    setCurrentUserRole(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    // Store the user data in localStorage
    localStorage.setItem(
      "user",
      JSON.stringify({
        role: currentUserRole,
        name: currentUser,
        id: currentTeacherId,
      })
    );
  }, [currentUserRole, currentUser, currentTeacherId]);

  return (
    <AuthContext.Provider
      value={{
        currentUserRole,
        currentUser,
        currentTeacherId,
        loginAdmin,
        loginTeacher,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
