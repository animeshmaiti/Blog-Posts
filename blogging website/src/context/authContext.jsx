import { createContext, useContext, useState,useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [isValid, setIsValid] = useState(false);
  // const [loading, setLoading] = useState(false);

  // ==================Login=============================
  const Login = async (inputData) => {
    // setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', inputData, {
        withCredentials: true
      });
      console.log(response.data);
      const data = response.data;
      toast.success('Login successful');
      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);
      setIsValid(true); // set user valid
      // console.log(data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        toast.error(err.response?.data?.error || 'Login failed');
      } else {
        console.log(err.message);
        toast.error('Server unreachable. Please try again later.');
      }
      setIsValid(false);
      setAuthUser(null);
    } finally {
      // setLoading(false);
      console.log("Login function executed");
    }
  };

  // =============SignUp==================
  const SignUp = async (inputData) => {
    // setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', inputData, {
        withCredentials: true
      });
      console.log(response.data);
      const data = response.data;
      toast.success('Login successful');
      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data);
      setIsValid(true);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        toast.error(err.response.data?.error || 'Account creation failed');
      } else {
        console.log(err.message);
        toast.error('Server unreachable. Please try again later.');
      }
      setIsValid(false);
      setAuthUser(null);
    } finally {
      // setLoading(false);
      console.log("SignUp function executed");
    }
    // console.log(data);
  };
  const validateUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/auth/validate', {
        withCredentials: true,
      });
      console.log(res.data); // user info
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsValid(true); // set user valid
      setAuthUser(res.data); // store user
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        toast.error(err.response.data?.error || 'Not authenticated');
      } else {
        console.log(err.message);
        toast.error('Server unreachable. Please try again later.');
      }
      setAuthUser(null);
      setIsValid(false);
    }
  };
  // ===================Logout=======================

  useEffect(() => {
    validateUser(); // auto-run on app load
  }, []);

  return (
    <authContext.Provider value={{ Login, SignUp, validateUser , authUser, isValid }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(authContext);
};
