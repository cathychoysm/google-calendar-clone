"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { lightFormat, startOfMonth } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

import GoogleIcon from "../GoogleIcon";
import { TextField } from "@mui/material";

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email is required.")
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email."),
      password: Yup.string().required("Password is required."),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInResponse && !signInResponse.error) {
        router.push(
          `/month/${lightFormat(startOfMonth(new Date()), "yyyy-MM-dd")}`
        );
      } else {
        setLoading(false);
        setError("Incorrect Email or Password.");
      }
    },
  });

  const handleGoogleLogin = async () => {
    setLoading(true);
    signIn("google");
  };

  return (
    <div className="bg-teal-50 w-screen h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg p-12 flex flex-col gap-8 text-gray-800">
        <GoogleIcon size={48} />
        <div className="flex flex-col gap-12 2xl:flex-row 2xl:gap-32">
          <div className="flex flex-col gap-6">
            <h4 className="text-4xl font-bold">Sign in</h4>
            <button
              onClick={handleGoogleLogin}
              className="flex flex-row items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 w-fit"
            >
              <GoogleIcon size={28} />
              <div>Sign in with Google</div>
            </button>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
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
            {error && <div className="text-red-600 text-xs">{error}</div>}
            <div className="flex flex-row self-end items-center gap-3 mt-6">
              <Link href="/register">
                <button
                  type="button"
                  className="rounded-full text-blue-600 text-sm hover:bg-teal-50 px-4 py-3"
                >
                  Create Account
                </button>
              </Link>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-3 flex flex-row justify-center"
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
                  <div className="text-white text-sm">Sign in</div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
