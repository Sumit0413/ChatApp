import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = ({ onSuccess }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";
      const response = await axios.post(
        `${apiBaseUrl}/api/v1/user/register`,
        data,
        { withCredentials: true }
      );
      alert("Registration successful! Please login.");
      console.log("Server Response:", response.data);
      
      // Navigate to login page after successful registration
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response) {
        alert(`Registration failed: ${error.response.data.message || 'Please try again.'}`);
      } else if (error.request) {
        alert("Unable to connect to server. Please check if the backend is running.");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto border border-gray-300  shadow-md p-6">
      {/* Entire content inside this box */}

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl text-blue-700 font-semibold">PVT MESSAGE</h1>
        <div className="h-9 w-9 border-2 border-blue-500 rounded-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1741768019347-7fd7730dc9ec?w=500&auto=format&fit=crop&q=60"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <img
        src="https://plus.unsplash.com/premium_photo-1684761949804-fd8eb9a5b6cc?q=80&w=774&auto=format&fit=crop"
        alt="Header"
        className="w-full h-40 object-cover rounded-lg mb-6"
      />

      <div>
        <h1 className="text-2xl font-semibold mb-2">Create Account</h1>
        <p className="mb-6 text-gray-600 text-sm">
          To create your account, we collect necessary details like your name and
          email. This helps personalize your chats and protect your account with
          encryption. Your conversations remain private — we never access or share
          your messages.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className={`border p-2 rounded-md w-full ${
              errors.fullname ? "border-red-500" : "border-gray-300"
            }`}
            {...register("fullname", {
              required: "Full name is required",
              minLength: { value: 2, message: "Full name must be at least 2 characters" },
            })}
          />
          {errors.fullname && (
            <span className="text-red-500 text-sm">{errors.fullname.message}</span>
          )}

          <input
            type="text"
            placeholder="Username"
            className={`border p-2 rounded-md w-full ${
              errors.userName ? "border-red-500" : "border-gray-300"
            }`}
            {...register("userName", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters" },
            })}
          />
          {errors.userName && (
            <span className="text-red-500 text-sm">{errors.userName.message}</span>
          )}

          <input
            type="password"
            placeholder="Password"
            className={`border p-2 rounded-md w-full ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            className={`border p-2 rounded-md w-full ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
          )}

          <div className="flex gap-5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="male"
                {...register("gender", { required: "Please select gender" })}
              />
              Male
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="female"
                {...register("gender", { required: "Please select gender" })}
              />
              Female
            </label>
          </div>
          {errors.gender && (
            <span className="text-red-500 text-sm">{errors.gender.message}</span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-3 text-white py-2 rounded-md transition-colors duration-200 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "REGISTERING..." : "REGISTER NOW"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
