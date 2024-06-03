"use client";

import { useState } from "react";

import { lightFormat, startOfMonth } from "date-fns";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import GoogleIcon from "@/components/GoogleIcon";
import { TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import { createUser } from "./action";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().trim().required("Name is required."),
      email: Yup.string()
        .required("Email is required.")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email."),
      password: Yup.string()
        .required("Password is required.")
        .min(8, "Password must contain at least 8 characters."),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const response = await createUser(values);

      if (response.hasOwnProperty("message")) {
        setLoading(false);
        setError(response.message);
      } else if (response.status === 500) {
        setLoading(false);
        console.error("Invalid values");
      } else {
        // if the user account has successfully created, sign in and redirect to /month/[month]
        const signInResponse = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInResponse && !signInResponse.error) {
          router.push(
            `/month/${lightFormat(startOfMonth(new Date()), "yyyy-MM-dd")}`
          );
        }
      }
    },
  });

  return (
    <div className="bg-teal-50 w-screen h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg p-12 flex flex-col gap-8 text-gray-800">
        <GoogleIcon size={48} />
        <div className="flex flex-col gap-12 2xl:flex-row 2xl:gap-32">
          <div className="flex flex-col gap-6">
            <h4 className="text-4xl font-bold">Create an Account</h4>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            <TextField
              type="text"
              name="name"
              autoComplete="off"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.name) && formik.touched.name}
              helperText={
                formik.errors.name && formik.touched.name
                  ? formik.errors.name
                  : ""
              }
              label="Full name"
              variant="outlined"
              sx={{
                minWidth: "300px",
              }}
            ></TextField>
            <TextField
              type="text"
              name="email"
              autoComplete="off"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.email) && formik.touched.email}
              helperText={
                formik.errors.email && formik.touched.email
                  ? formik.errors.email
                  : ""
              }
              label="Email"
              variant="outlined"
              sx={{
                minWidth: "300px",
              }}
            ></TextField>
            <TextField
              type="password"
              name="password"
              autoComplete="off"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.password) && formik.touched.password}
              helperText={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ""
              }
              label="Password"
              variant="outlined"
            ></TextField>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button
              type="submit"
              className="self-end rounded-full bg-blue-600 px-4 py-3 flex flex-row justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin mx-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <div className="text-white text-sm">Create</div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
