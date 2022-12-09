import React from "react";
import config from "../config";

export default async function checkAccess(setAccessLevel) {
  const response = await fetch(config.BACKEND_URL + "auth/checkaccess", {
    mode: "cors",
    credentials: "include",
  });
  if (response.status === 200) {
    let accessLevel = await response.json();
    setAccessLevel(accessLevel);
  } else {
    console.log(
      "Error, unable to check user access level. Might not be logged in"
    );
  }
}
