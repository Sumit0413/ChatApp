import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onSuccess }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Login Data:", data);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";
      let resp = await axios.post(
        `${apiBaseUrl}/api/v1/user/Login`,
        data,
        { withCredentials: true }
      );

      alert("Login successful!");
      console.log("Server Response:", resp.data);
      
      // Call the parent's refresh function to update auth state
      if (onSuccess) {
        await onSuccess();
      }
      
      // Navigate to home page after successful login
      navigate("/home");
    } catch (error) {
      console.error("Error logging in user:", error);
      if (error.response) {
        alert(`Login failed: ${error.response.data.message || 'Please check your credentials.'}`);
      } else if (error.request) {
        alert("Unable to connect to server. Please check if the backend is running.");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl text-blue-700 font-bold">
            PVT MESSAGE
          </h1>
          <div className="h-10 w-10 border-2 border-blue-500 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1741768019347-7fd7730dc9ec?w=500&auto=format&fit=crop&q=60"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Banner */}
        <img
          src="https://plus.unsplash.com/premium_photo-1684761949804-fd8eb9a5b6cc?q=80&w=774&auto=format&fit=crop"
          alt="Header"
          className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md mb-5"
        />

        {/* Title */}
        <div className="mb-5 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold">LOGIN</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Welcome back! Sign in to continue your private conversations.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className={`border p-2 rounded-md w-full text-sm sm:text-base ${
                errors.userName ? "border-red-500" : "border-gray-300"
              }`}
              {...register("userName", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />
            {errors.userName && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.userName.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`border p-2 rounded-md w-full text-sm sm:text-base ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs sm:text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-2 text-white px-4 py-2 rounded-md transition duration-200 text-sm sm:text-base ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
