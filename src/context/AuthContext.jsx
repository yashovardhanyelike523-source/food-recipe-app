import React, {
  createContext,
  useContext,
  useState
} from "react";

import {
  getLoggedInUser,
  setLoggedInUser,
  removeLoggedInUser
} from "../utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(
    getLoggedInUser
  );


  const login = (u) => {
    setLoggedInUser(u);
    setUser(u);
  };

  const logout = () => {
    removeLoggedInUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;