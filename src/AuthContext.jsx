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

      console.log("LOGIN RESPONSE:", loggedInUser);

      if (!loggedInUser || !loggedInUser.id) {
        alert("Invalid login response");
        return;
      }

      setUser(loggedInUser);
      localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

      console.log("SAVED USER:", localStorage.getItem("currentUser"));
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Invalid email or password");
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

      console.log("SIGNUP RESPONSE:", newUser);

      if (!newUser?.id) {
        throw new Error(newUser?.message || 'Signup failed');
      }

      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("SIGNUP ERROR:", error);
      alert(error.message || 'Unable to create account.');
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