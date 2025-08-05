import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    // Add your login logic here
  };

  return (
    <>
      <div className="mx-5">
        <div className="flex mt-3 mb-2 items-center justify-between">
          <h1 className="text-xl text-blue-700 flex justify-center pt-3 pb-2">
            PVT MESSAGE
          </h1>

          <div className="h-9 w-9 border-2 border-blue-500 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1741768019347-7fd7730dc9ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Profile"
              className="w-full h-full object-center object-cover" 
            />
          </div>
        </div>

        <img
          src="https://plus.unsplash.com/premium_photo-1684761949804-fd8eb9a5b6cc?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Header"
          className="h-38 w-full object-center object-cover"
        />

        <div className="my-5">
          <h1 className="text-2xl font-semibold">LOGIN</h1>
          <p>
            Welcome back! Sign in to continue your private conversations.
            Your messages remain encrypted and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">Username</h1>
          <input
            type="text"
            placeholder="Username"
            className={`border p-2 rounded-md w-full ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            })}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}

          <h1 className="text-lg font-semibold">Password</h1>
          <input
            type="password"
            placeholder="Password"
            className={`border p-2 rounded-md w-full ${
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
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-3 mb-3 text-white px-4 py-2 rounded-md transition duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "LOGGING IN..." : "LOGIN"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account? <Link to="/" className="text-blue-500">Register here</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;