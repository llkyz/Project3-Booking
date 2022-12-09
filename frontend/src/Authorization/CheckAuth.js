import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import config from "../config";

export default function CheckAuth({ Primary, Alternative, action }) {
  const [authentication, setAuthentication] = useState({
    loading: true,
    redirect: false,
  });

  useEffect(() => {
    async function checkToken() {
      const response = await fetch(config.BACKEND_URL + "checktoken", {
        mode: "cors",
        credentials: "include",
      });
      if (response.status === 200) {
        setAuthentication({ ...authentication, loading: false });
      } else {
        setAuthentication({ loading: false, redirect: true });
      }
    }
    checkToken();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      {authentication.loading ? (
        ""
      ) : authentication.redirect && action === "redirect" ? (
        <Navigate to={Alternative} replace={true} />
      ) : authentication.redirect ? (
        <Alternative />
      ) : (
        <Primary />
      )}
    </>
  );
}
