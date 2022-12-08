import React from "react";
import config from "../config";

export default function Register() {
  return (
    <>
      <h1>Register New User</h1>
      <form method="POST" action={config.BACKEND_URL + "user/"}>
        <input type="text" name="username" placeholder="User Name" />
        <input type="text" name="password" placeholder="Password" />
        <input type="submit" value="Register" />
      </form>
    </>
  );
}
