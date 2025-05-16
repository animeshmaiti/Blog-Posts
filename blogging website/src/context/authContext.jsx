import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { authWithGoogle } from '../common/firebase';

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);

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
      localStorage.setItem('user', JSON.stringify(data));
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
      console.log('Login function executed');
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
      localStorage.setItem('user', JSON.stringify(data));
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
      console.log('SignUp function executed');
    }
    // console.log(data);
  };

  // ==================Google Auth=======================
  const GoogleAuth = async () => {
    // setLoading(true);
    try {
      const { token, user } = await authWithGoogle(); // get Firebase user + ID token

      const response = await axios.post('http://localhost:3000/api/auth/google-auth', {
        access_token: token,
      }, {
        withCredentials: true,
      });

      const data = response.data;
      toast.success('Google Sign-in successful');
      localStorage.setItem('user', JSON.stringify(data));
      setAuthUser(data);
      setIsValid(true);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        toast.error(err.response?.data?.error || 'Google Sign-in failed');
      } else {
        console.log(err.message);
        toast.error('Server unreachable. Please try again later.');
      }
      setIsValid(false);
      setAuthUser(null);
    } finally {
      // setLoading(false);
      console.log('GoogleAuth function executed');
    }
  };


  // ===================Logout=======================
  const LogOut = async () => {
    // setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/auth/logout', {
        withCredentials: true
      });
      console.log(response.data);
      localStorage.removeItem('user');
      setAuthUser(null);
      setIsValid(false); // set user invalid
      toast.success('Logout successful');
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        toast.error(err.response.data?.error || 'Logout failed');
      } else {
        console.log(err.message);
        toast.error('Server unreachable. Please try again later.');
      }
    } finally {
      // setLoading(false);
      console.log('Logout function executed');
    }
  };

  const validateUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/auth/validate', {
        withCredentials: true,
      });
      // console.log(res.data); // user info
      localStorage.setItem('user', JSON.stringify(res.data));
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
    }finally{
      setLoading(false);
      console.log('validateUser function executed');
    }
  };

  useEffect(() => {
    validateUser(); // auto-run on app load
  }, []);

  return (
    <authContext.Provider value={{ Login, SignUp, LogOut, GoogleAuth, validateUser, authUser, isValid, loading,setLoading }}>
      {children}
    </authContext.Provider>
  );
};

