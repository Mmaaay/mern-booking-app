import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {showToast} = useAppContext();
  
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({message : "Registration Success!" , type : "SUCCESS"})
      await queryClient.invalidateQueries("validateToken");
      navigate("/")
    },
    onError: (error: Error) => {
      showToast({message : error.message , type:"ERROR"} )
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label
          htmlFor="firstName"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("firstName", { required: "This field is required" })}
            type="text"
            id="firstName"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>

        <label
          htmlFor="lastName"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            {...register("lastName", { required: "This field is required" })}
            type="text"
            id="lastName"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
      </div>
      <label htmlFor="Email" className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          type="text"
          id="Email"
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>

      <label
        htmlFor="Password"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: { value: 8, message: "Must be at least 8 Characters" },
          })}
          type="Password"
          id="Password"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label
        htmlFor="ConfirmPassword"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Confirm Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) {
                return "This field is required";
              } else if (watch("password") !== val) {
                return "Passwords do not match";
              }
            },
          })}
          type="Password"
          id="ConfirmPassword"
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 mt-3 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
