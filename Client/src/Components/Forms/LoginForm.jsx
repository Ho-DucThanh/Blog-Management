import AuthInput from "../Common/AuthInput";
import Button from "../Common/Button";
import React, { useContext } from "react";
import { LoginContext } from "../../Context/Auth/LoginContext";

export default function LoginForm() {
  const { email, password, error, setEmail, setPassword, handleSubmit } =
    useContext(LoginContext);
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
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div>
        <Button type="submit" children="Sign in"></Button>
      </div>
    </form>
  );
}
