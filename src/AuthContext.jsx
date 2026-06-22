import { loginUser, registerUser } from "./api/userApi";
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    console.log("Auth User:", user);
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);

    try {
      const loggedInUser = await loginUser({
        email,
        password,
      });

      if (!loggedInUser || !loggedInUser.id || !loggedInUser.token) {
        alert("Invalid login response");
        return;
      }

      setUser(loggedInUser);
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      if (error instanceof TypeError) {
        alert("Unable to reach auth server. Check your API URL and backend status.");
      } else {
        alert(error.message || "Invalid email or password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, username, email, password) => {
    setIsLoading(true);

    try {
      const newUser = await registerUser({
        name,
        username,
        email,
        password,
      });

      if (!newUser?.id) {
        throw new Error(newUser?.message || 'Signup failed');
      }

      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      if (error instanceof TypeError) {
        alert("Unable to reach auth server. Check your API URL and backend status.");
      } else {
        alert(error.message || 'Unable to create account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}