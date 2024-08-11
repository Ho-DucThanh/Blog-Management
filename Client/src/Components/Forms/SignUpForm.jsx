import AuthInput from "../Common/AuthInput";
import Button from "../Common/Button";
import React, { useContext } from "react";
import { SignupContext } from "../../Context/Auth/SignUpContext";

export default function SignUpForm() {
  const {
    email,
    password,
    confirmPassword,
    error,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useContext(SignupContext);
  return (
    <form
      action="#"
      method="POST"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <AuthInput
        label="Email Address"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthInput
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <AuthInput
        label="Confirm Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        autoComplete="current-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <Button type="submit" children="Sign up"></Button>
      </div>
    </form>
  );
}
