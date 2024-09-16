import React from "react";
import LoginForm from "../../Components/Forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-8 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://img.freepik.com/free-vector/school-logo-template_23-2149713033.jpg"
          className="mx-auto h-32 w-auto"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />

        <div className="mt-10 flex justify-between text-sm">
          <div>
            <p className="text-center text-gray-500">
              Not a member?{" "}
              <a
                href="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign up now!
              </a>
            </p>
          </div>
          <div>
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
