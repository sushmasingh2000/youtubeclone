import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../utils/APIRoutes";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect to dashboard if already logged in
      navigate("/dashboard");
    }
  }, [navigate]);

  const initialValue = {
    email: "",
    password: "",
  };

  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,

    onSubmit: () => {
      const reqbody = {
        email: fk.values.email,
        password: fk.values.password,
      };
      LoginFn(reqbody);
    },
  });

  const LoginFn = async (reqbody) => {
    try {
      const response = await axios.post(endpoint?.login_api, reqbody, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

      toast(response?.data?.msg, { id: 1 });

      if (response?.data?.msg === "Login SuccessFully.") {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("ID", response?.data?.user?.id);
        localStorage.setItem("name", response?.data?.user?.username);
        localStorage.setItem("user_pin", response?.data?.user?.set_password);
        navigate("/verify"); 
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366]">
      <div className="w-full max-w-sm lg:p-6 p-4 bg-white rounded shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-[#25D366] mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={fk.values.email}
            onChange={fk.handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] transition duration-300 ease-in-out transform hover:scale-105"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={fk.values.password}
            onChange={fk.handleChange}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] transition duration-300 ease-in-out transform hover:scale-105"
            required
          />
        </div>
        <button
          onClick={() => fk.handleSubmit()}
          className="w-full py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#128C7E] transition duration-300 ease-in-out transform hover:scale-105"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <span
              className="text-[#25D366] cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
