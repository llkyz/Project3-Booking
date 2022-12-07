import React from "react";

export default function Register() {
  return (
    <>
      <h1>Register New User</h1>
      <form method="POST" action="http://127.0.0.1:5000/user/">
        <input type="text" name="username" placeholder="User Name" />
        <input type="text" name="password" placeholder="Password" />
        <input type="submit" value="Register" />
      </form>
    </>
  );
}
